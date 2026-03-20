<?php

namespace Block2Docs\Tests\Fixtures;

/**
 * A sample class for testing.
 *
 * This class demonstrates various PHP constructs for parser testing.
 *
 * @since 1.0.0
 */
class SampleClass
{
    /** @var string The name to use. */
    private string $name;

    public const VERSION = '1.0.0';

    /**
     * Create a new instance.
     *
     * @param string $name The name.
     */
    public function __construct(string $name = 'World')
    {
        $this->name = $name;
    }

    /**
     * Return a greeting.
     *
     * @param string $prefix Optional prefix.
     * @return string The greeting string.
     */
    public function greet(string $prefix = 'Hello'): string
    {
        return "{$prefix}, {$this->name}!";
    }

    /**
     * A static helper.
     *
     * @deprecated 2.0.0 Use greet() instead.
     */
    public static function legacyGreet(string $name): string
    {
        return "Hello, {$name}!";
    }
}
