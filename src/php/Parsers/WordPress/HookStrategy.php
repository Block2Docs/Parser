<?php

namespace Block2Docs\Parsers\WordPress;

use phpDocumentor\Reflection\DocBlockFactory;
use phpDocumentor\Reflection\DocBlock\Tags\Param;
use phpDocumentor\Reflection\DocBlock\Tags\Return_;
use phpDocumentor\Reflection\Php\ProjectFactoryStrategy;
use phpDocumentor\Reflection\Php\StrategyContainer;
use PhpParser\Node\Expr\FuncCall;
use PhpParser\Node\Stmt\Expression;
use phpDocumentor\Reflection\Php\Factory\ContextStack;

final class HookStrategy implements ProjectFactoryStrategy
{
    private const HOOK_FUNCTIONS = [
        'do_action',
        'do_action_ref_array',
        'do_action_deprecated',
        'apply_filters_ref_array',
        'apply_filters_deprecated',
        'apply_filters',
    ];

    private const TYPE_MAP = [
        'do_action'                => 'action',
        'do_action_ref_array'      => 'action_reference',
        'do_action_deprecated'     => 'action_deprecated',
        'apply_filters_ref_array'  => 'filter_reference',
        'apply_filters_deprecated' => 'filter_deprecated',
        'apply_filters'            => 'filter',
    ];

    /**
     * Check if the object is a function call to a WordPress hook.
     */
    public function matches(ContextStack $context, object $object): bool
    {
        if ($object instanceof Expression === false) {
            return false;
        }

        if (! $object->expr instanceof FuncCall) {
            return false;
        }

        $name = (string) $object->expr->name;

        return in_array($name, self::HOOK_FUNCTIONS);
    }

    /**
     * Create a hook metadata object with all data extracted from the AST node.
     */
    public function create(ContextStack $context, object $object, StrategyContainer $strategies): void
    {
        $funcName = (string) $object->expr->name;

        $hook = new Hook(
            $object->getStartLine(),
            $this->cleanupName($funcName),
            self::TYPE_MAP[$funcName] ?? 'filter',
            $this->extractArgs($object),
            $this->extractDocBlock($object),
        );

        $method = $context->peek();
        $method->addMetadata($hook);
    }

    /**
     * @param string $name
     *
     * @return string
     */
    private function cleanupName($name)
    {
        $matches = array();

        // quotes on both ends of a string
        if (preg_match('/^[\'"]([^\'"]*)[\'"]$/', $name, $matches)) {
            return $matches[1];
        }

        // two concatenated things, last one of them a variable
        if (
            preg_match(
                '/(?:[\'"]([^\'"]*)[\'"]\s*\.\s*)?' . // First filter name string (optional)
                '(\$[^\s]*)' .                        // Dynamic variable
                '(?:\s*\.\s*[\'"]([^\'"]*)[\'"])?/',  // Second filter name string (optional)
                $name,
                $matches
            )
        ) {
            if (isset($matches[3])) {
                return $matches[1] . '{' . $matches[2] . '}' . $matches[3];
            } else {
                return $matches[1] . '{' . $matches[2] . '}';
            }
        }

        return $name;
    }

    private function extractArgs(Expression $expression): array
    {
        $args = [];
        foreach ($expression->expr->args as $arg) {
            $args[] = $this->nodeToString($arg);
        }

        // Skip the hook name (first argument)
        array_shift($args);

        return $args;
    }

    private function nodeToString($node): string
    {
        $prettyPrinter = new \PhpParser\PrettyPrinter\Standard();
        return $prettyPrinter->prettyPrintExpr($node->value);
    }

    private function extractDocBlock(Expression $expression): ?array
    {
        $comment = $expression->getDocComment();

        if ($comment === null) {
            return null;
        }

        $docblockFactory = DocBlockFactory::createInstance();
        $docblock = $docblockFactory->create($comment->getText());

        $tags = [];
        foreach ($docblock->getTags() as $tag) {
            $entry = [
                'name'        => $tag->getName(),
                'description' => $tag->getDescription() ? (string) $tag->getDescription() : null,
            ];

            if ($tag instanceof Param) {
                $entry['variable'] = $tag->getVariableName();
                $entry['type']     = $tag->getType() ? (string) $tag->getType() : null;
            } elseif ($tag instanceof Return_) {
                $entry['type'] = $tag->getType() ? (string) $tag->getType() : null;
            }

            $tags[] = $entry;
        }

        return [
            'summary'     => $docblock->getSummary(),
            'description' => (string) $docblock->getDescription(),
            'tags'        => $tags,
        ];
    }
}
