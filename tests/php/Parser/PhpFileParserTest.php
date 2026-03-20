<?php

declare(strict_types=1);

namespace Block2Docs\Tests\Parser;

use Block2Docs\Parsers\PhpFileParser;
use PHPUnit\Framework\TestCase;

class PhpFileParserTest extends TestCase
{
    private PhpFileParser $parser;

    protected function setUp(): void
    {
        $this->parser = new PhpFileParser();
    }

    public function testParseFileReturnsStructuredData(): void
    {
        $result = $this->parser->parseFile(__DIR__ . '/fixtures/SampleClass.php');

        $this->assertArrayHasKey('classes', $result);
        $this->assertCount(1, $result['classes']);

        $class = $result['classes'][0];
        $this->assertSame('SampleClass', $class['name']);
        $this->assertSame('A sample class for testing.', $class['docblock']['summary']);
    }

    public function testParseFileExtractsMethods(): void
    {
        $result = $this->parser->parseFile(__DIR__ . '/fixtures/SampleClass.php');
        $class = $result['classes'][0];

        $methodNames = array_column($class['methods'], 'name');
        $this->assertContains('greet', $methodNames);
    }

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

    public function testParseDirectoryReturnsAllFiles(): void
    {
        $result = $this->parser->parseDirectory(__DIR__ . '/fixtures');

        $this->assertNotEmpty($result);
        $this->assertArrayHasKey('SampleClass.php', $result);
    }

    public function testParseDirectoryEmptyReturnsEmpty(): void
    {
        $tmpDir = sys_get_temp_dir() . '/block2docs_test_' . uniqid();
        mkdir($tmpDir);

        $result = $this->parser->parseDirectory($tmpDir);
        $this->assertSame([], $result);

        rmdir($tmpDir);
    }
}
