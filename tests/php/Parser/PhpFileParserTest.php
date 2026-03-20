<?php

declare(strict_types=1);

namespace Block2Docs\Tests\Parser;

use Block2Docs\Parser\PhpFileParser;
use PHPUnit\Framework\TestCase;

class PhpFileParserTest extends TestCase
{
    public function testParseReturnsArray(): void
    {
        $parser = new PhpFileParser();
        $result = $parser->parse('/nonexistent/path');

        $this->assertIsArray($result);
    }
}
