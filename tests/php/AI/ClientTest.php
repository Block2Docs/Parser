<?php

declare(strict_types=1);

namespace Block2Docs\Tests\AI;

use Block2Docs\AI\Client;
use PHPUnit\Framework\TestCase;

class ClientTest extends TestCase
{
    public function testCompleteReturnsString(): void
    {
        $client = new Client('openai', 'gpt-4', 'test-key');
        $result = $client->complete('Hello');

        $this->assertIsString($result);
    }
}
