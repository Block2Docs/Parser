<?php

declare(strict_types=1);

namespace Block2Docs\Command;

use Block2Docs\Parsers\PhpFileParser;

class ParseCommand
{
    /**
     * Execute the parse command.
     *
     * @param array<string> $args The arguments to the command.
     * @return void
     */
    public function execute(array $args): void
    {
        $directory = $args[0] ?? null;
        $outputFile = $args[1] ?? null;
        $format = 'json';

        // Parse flags
        foreach ($args as $arg) {
            if ($arg === '--pretty') {
                $format = 'json-pretty';
            }
        }

        if ($directory === null) {
            fwrite(STDERR, "Usage: block2docs parse <directory> [output.json] [--pretty]\n");
            exit(1);
        }

        // Treat non-flag arguments as positional
        $positional = array_values(array_filter($args, fn($a) => !str_starts_with($a, '--')));
        $directory = $positional[0];
        $outputFile = $positional[1] ?? null;

        $directory = realpath($directory);
        if ($directory === false || !is_dir($directory)) {
            fwrite(STDERR, "Error: '{$args[0]}' is not a valid directory.\n");
            exit(1);
        }

        fwrite(STDERR, "Parsing PHP files in {$directory}...\n");

        $parser = new PhpFileParser();
        $result = $parser->parseDirectory($directory);

        $fileCount = count($result);
        $functionCount = 0;
        $classCount = 0;

        foreach ($result as $file) {
            $functionCount += count($file['functions'] ?? []);
            $classCount += count($file['classes'] ?? []);
        }

        fwrite(STDERR, "Parsed {$fileCount} files, {$classCount} classes, {$functionCount} functions.\n");

        $jsonFlags = JSON_UNESCAPED_SLASHES;
        if ($format === 'json-pretty') {
            $jsonFlags |= JSON_PRETTY_PRINT;
        }

        $json = json_encode($result, $jsonFlags);

        if ($outputFile !== null) {
            $bytes = file_put_contents($outputFile, $json . "\n");
            if ($bytes === false) {
                fwrite(STDERR, "Error: Could not write to {$outputFile}\n");
                exit(1);
            }
            fwrite(STDERR, "Output written to {$outputFile}\n");
        } else {
            echo $json . "\n";
        }
    }
}
