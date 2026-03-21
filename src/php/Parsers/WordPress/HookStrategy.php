<?php

namespace Block2Docs\Parsers\WordPress;

use Block2Docs\Parsers\WordPress\Hook;
use phpDocumentor\Reflection\Php\ProjectFactory;
use phpDocumentor\Reflection\Php\ProjectFactoryStrategy;
use phpDocumentor\Reflection\Php\StrategyContainer;
use PhpParser\Node\Expr\FuncCall;
use PhpParser\Node\Stmt\Expression;
use phpDocumentor\Reflection\Php\Factory\ContextStack;

final class HookStrategy implements ProjectFactoryStrategy
{
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

        $name = (string)$object->expr->name;

        $hooks = [
           'do_action',
           'do_action_ref_array',
           'do_action_deprecated',
           'apply_filters_ref_array',
           'apply_filters_deprecated',
           'apply_filters'
        ];

        return in_array($name, $hooks);
    }

    /**
     * Create a hook metadata object.
     */
    public function create(ContextStack $context, object $object, StrategyContainer $strategies): void
    {
        $method = $context->peek();
        $method->addMetadata(new Hook($object));
    }
}
