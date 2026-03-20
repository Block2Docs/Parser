<?php

declare(strict_types=1);

namespace Block2Docs\Tests\AI;

use Block2Docs\AI\PromptBuilder;
use PHPUnit\Framework\TestCase;

class PromptBuilderTest extends TestCase
{
    private string $fixturesDir;

    protected function setUp(): void
    {
        $this->fixturesDir = sys_get_temp_dir() . '/block2docs_test_prompts';
        if (!is_dir($this->fixturesDir)) {
            mkdir($this->fixturesDir, 0777, true);
        }
    }

    protected function tearDown(): void
    {
        array_map('unlink', glob($this->fixturesDir . '/*'));
        rmdir($this->fixturesDir);
    }

    public function testBuildReplacesVariables(): void
    {
        file_put_contents(
            $this->fixturesDir . '/greeting.txt',
            'Hello, {{name}}! Welcome to {{project}}.'
        );

        $builder = new PromptBuilder($this->fixturesDir);
        $result = $builder->build('greeting', [
            'name' => 'World',
            'project' => 'Block2Docs',
        ]);

        $this->assertSame('Hello, World! Welcome to Block2Docs.', $result);
    }

    public function testBuildWithNoVariables(): void
    {
        file_put_contents(
            $this->fixturesDir . '/static.txt',
            'No placeholders here.'
        );

        $builder = new PromptBuilder($this->fixturesDir);
        $result = $builder->build('static', []);

        $this->assertSame('No placeholders here.', $result);
    }
}
