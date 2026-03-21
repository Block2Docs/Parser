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
        /**
         * I'm a comment.
         *
         * @since 1.0.1
         *
         * @param string $prefix Optional prefix.
         */
        do_action( 'hook_do_action', $prefix );
        return "{$prefix}, {$this->name}!";
    }

    /**
     * A static helper.
     *
     * @deprecated 2.0.0 Use greet() instead.
     */
    public static function legacyGreet(string $name): string
    {
        add_action( 'hook_name_add_action', function( $prefix ) {
            return "{$prefix}, {$this->name}!";
        }, 10, 1 );

        add_filter( 'hook_name_add_filter', [ self::class, 'greet' ], 10, 1 );
        return "Hello, {$name}!";
    }
}
