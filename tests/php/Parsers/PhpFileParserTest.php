<?php

declare(strict_types=1);

namespace Block2Docs\Tests\Parser;

use Block2Docs\Parsers\PhpFileParser;
use PHPUnit\Framework\TestCase;

class PhpFileParserTest extends TestCase
{
    /**
     * The PHP file parser.
     *
     * @var PhpFileParser
     */
    private PhpFileParser $parser;

    /**
     * Set up the test environment.
     *
     * @return void
     */
    protected function setUp(): void
    {
        $this->parser = new PhpFileParser();
    }

    /**
     * Test that the parse file method returns structured data.
     *
     * @return void
     */
    public function testParseFileReturnsStructuredData(): void
    {
        $result = $this->parser->parseFile(__DIR__ . '/fixtures/SampleClass.php');

        $this->assertArrayHasKey('classes', $result);
        $this->assertCount(1, $result['classes']);

        $class = $result['classes'][0];
        $this->assertSame('SampleClass', $class['name']);
        $this->assertSame('A sample class for testing.', $class['docblock']['summary']);
    }

    /**
     * Test that the parse file method extracts methods.
     *
     * @return void
     */
    public function testParseFileExtractsMethods(): void
    {
        $result = $this->parser->parseFile(__DIR__ . '/fixtures/SampleClass.php');
        $class = $result['classes'][0];

        $methodNames = array_column($class['methods'], 'name');
        $this->assertContains('greet', $methodNames);
    }

    /**
     * Test that the parse file method extracts docblock tags.
     *
     * @return void
     */
    public function testParseFileExtractsDocblockTags(): void
    {
        $result = $this->parser->parseFile(__DIR__ . '/fixtures/SampleClass.php');
        $class = $result['classes'][0];

        $greet = null;
        foreach ($class['methods'] as $method) {
            if ($method['name'] === 'greet') {
                $greet = $method;
                break;
            }
        }

        $this->assertNotNull($greet);
        $this->assertNotNull($greet['docblock']);

        $paramTags = array_filter($greet['docblock']['tags'], fn($t) => $t['name'] === 'param');
        $this->assertNotEmpty($paramTags);
    }

    /**
     * Test that the parse directory method returns all files.
     *
     * @return void
     */
    public function testParseDirectoryReturnsAllFiles(): void
    {
        $result = $this->parser->parseDirectory(__DIR__ . '/fixtures');

        $this->assertNotEmpty($result);
        $this->assertArrayHasKey('SampleClass.php', $result);
    }

    /**
     * Test that the parse directory method returns an empty array if the directory is empty.
     *
     * @return void
     */
    public function testParseDirectoryEmptyReturnsEmpty(): void
    {
        $tmpDir = sys_get_temp_dir() . '/block2docs_test_' . uniqid();
        mkdir($tmpDir);

        $result = $this->parser->parseDirectory($tmpDir);
        $this->assertSame([], $result);

        rmdir($tmpDir);
    }

    /**
     * Test that the parse file method extracts the needs-docs tag.
     *
     * @return void
     */
    public function testParseFileExtractsNeedsDocsTag(): void
    {
        $result = $this->parser->parseFile(__DIR__ . '/fixtures/SampleClass.php');
        $class = $result['classes'][0];

        $greet = null;
        foreach ($class['methods'] as $method) {
            if ($method['name'] === 'greet') {
                $greet = $method;
                break;
            }
        }

        $this->assertNotNull($greet);
        $needsDocsTags = array_filter($greet['docblock']['tags'], fn($t) => $t['name'] === 'needs-docs');
        $this->assertNotEmpty($needsDocsTags);

        $needsDocs = array_values($needsDocsTags)[0];
        $this->assertSame('Add usage examples for greeting customization.', $needsDocs['description']);
    }

    /**
     * Test the parse file method returns hooks.
     *
     * @return void
     */
    public function testParseFileReturnsHooksAndAddedHooks(): void
    {
        $result = $this->parser->parseFile(__DIR__ . '/fixtures/SampleClass.php');
        $class = $result['classes'][0];

        $this->assertArrayHasKey('hooks', $class);
        $this->assertArrayHasKey('added_hooks', $class);

        $this->assertNotEmpty($class['hooks']);
        $this->assertNotEmpty($class['added_hooks']);

        $this->assertContains('edit_post', $class['hooks']);
        $this->assertContains('the_title', $class['added_hooks']);
    }
}
