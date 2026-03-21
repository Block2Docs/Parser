<?php

declare(strict_types=1);

namespace Block2Docs\Tests\Parser;

use Block2Docs\Parser\BlockParser;
use PHPUnit\Framework\TestCase;

class BlockParserTest extends TestCase
{
    /**
     * Test that the block parser returns an array.
     *
     * @todo Implement the block parser.
     *
     * @return void
     */
    public function testParseReturnsArray(): void
    {
        $parser = new BlockParser();
        $result = $parser->parse('/nonexistent/path');

        $this->assertIsArray($result);
    }
}
