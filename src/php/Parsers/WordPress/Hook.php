<?php

namespace Block2Docs\Parsers\WordPress;

use phpDocumentor\Reflection\Metadata\Metadata;

/**
 * This class adds WordPress hook metadata.
 *
 * @since 1.0.0
 * @package Block2Docs\Parsers\WordPress
 * @author Block2Docs
 * @version 1.0.0
 * @license MIT
 * @copyright 2026 Block2Docs
 * @link https://block2docs.com
 * @needs-reassurance
 */
final class Hook implements Metadata
{
    private int $line;
    private string $name;
    private string $type;
    private array $args;
    private ?array $docblock;

    /**
     * Construct the hook metadata object.
     *
     * @needs-docs Add an example of how to use this class in a strategy.
     *
     * @param int         $line     The line number of the hook call.
     * @param string      $name     The hook name.
     * @param string      $type     The hook type (action, filter, etc.).
     * @param array       $args     The hook arguments (excluding the hook name).
     * @param array|null  $docblock The parsed docblock, if any.
     */
    public function __construct(int $line, string $name, string $type, array $args, ?array $docblock)
    {
        $this->line = $line;
        $this->name = $name;
        $this->type = $type;
        $this->args = $args;
        $this->docblock = $docblock;
    }

    /**
     * Get the key for the hook metadata.
     *
     * @return string The key for the hook metadata.
     */
    public function key(): string
    {
        return "hook_{$this->line}";
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @return string
     */
    public function getShortName()
    {
        return $this->name;
    }

    /**
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @return array
     */
    public function getArgs()
    {
        return $this->args;
    }

    public function format()
    {
        return [
            'name' => $this->name,
            'type' => $this->type,
            'args' => $this->args,
            'docblock' => $this->docblock,
        ];
    }

    public function getDocBlock(): ?array
    {
        return $this->docblock;
    }
}
