<?php

namespace Doc2Me\Tests\Fixtures;

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
     * @needs-docs Add usage examples for greeting customization.
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

    public static function milanaQuestions(): void {
        add_action( 'edit_post', [ self::class, 'greet' ] );

        add_filter( 'the_title', [ self::class, 'greet' ] );

        $option = 'option_name';
        $pre_option = 'pre_option_value';
        $value = 'value';
        apply_filters( "pre_option_{$option}", $pre_option, $option, $value );
    }
}
