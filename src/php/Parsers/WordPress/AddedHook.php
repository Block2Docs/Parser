<?php

namespace Block2Docs\Parsers\WordPress;

use phpDocumentor\Reflection\DocBlockFactory;
use phpDocumentor\Reflection\Metadata\Metadata;
use PhpParser\Node\Stmt\Expression;
use phpDocumentor\Reflection\DocBlock\Tags\Param;
use phpDocumentor\Reflection\DocBlock\Tags\Return_;

final class AddedHook implements Metadata
{
    private $hook;
    /**
     * Construct the added hook metadata object.
     *
     * @param Expression $hook The hook name.
     */
    public function __construct(Expression $hook)
    {
        $this->hook = $hook;
    }

    /**
     * Get the key for the hook metadata.
     *
     * @return string The key for the hook metadata.
     */
    public function key(): string
    {
        $line = $this->hook->getStartLine();
        return "added_hook_{$line}";
    }

    /**
     * Get the hook name.
     *
     * @return string The hook name.
     */
    public function hook(): string
    {
        return $this->hook->expr->name->toString();
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->cleanupName((string) $this->hook->expr->name);
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

    /**
     * @return string
     */
    public function getShortName()
    {
        return $this->getName();
    }

    /**
     * @return string
     */
    public function getType()
    {
        $type = 'filter';
        switch ((string) $this->hook->expr->name) {
            case 'add_filter':
                $type = 'filter';
                break;
            case 'add_action':
                $type = 'action';
                break;
        }

        return $type;
    }

    /**
     * @return array
     */
    public function getArgs()
    {
        $args    = [];
        foreach ($this->hook->expr->args as $arg) {
            $args[] = $arg;
        }

        // Skip the filter name
        array_shift($args);

        return $args;
    }

    public function format()
    {
        return [
            'hook' => $this->hook,
            'name' => $this->getName(),
            'type' => $this->getType(),
            'args' => $this->getArgs(),
            'docblock' => $this->getDocBlock(),
        ];
    }

    public function getDocBlock(): ?array
    {
        $comment = $this->hook->getDocComment();

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
