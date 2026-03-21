<?php

declare(strict_types=1);

namespace Block2Docs\Parsers;

use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use phpDocumentor\Reflection\DocBlock;
use Block2Docs\Parsers\WordPress\AddedHook;
use Block2Docs\Parsers\WordPress\AddedHookStrategy;
use Block2Docs\Parsers\WordPress\Hook;
use Block2Docs\Parsers\WordPress\HookStrategy;
use phpDocumentor\Reflection\File\LocalFile;
use phpDocumentor\Reflection\Php\Argument;
use phpDocumentor\Reflection\Php\Class_;
use phpDocumentor\Reflection\Php\Constant;
use phpDocumentor\Reflection\Php\Enum_;
use phpDocumentor\Reflection\Php\File as PhpFile;
use phpDocumentor\Reflection\Php\Function_;
use phpDocumentor\Reflection\Php\Interface_;
use phpDocumentor\Reflection\Php\Method;
use phpDocumentor\Reflection\Php\ProjectFactory;
use phpDocumentor\Reflection\Php\Property;
use phpDocumentor\Reflection\Php\Trait_;
use phpDocumentor\Reflection\DocBlock\Tags\Param;
use phpDocumentor\Reflection\DocBlock\Tags\Return_;

class PhpFileParser
{
    /**
     * The project factory.
     *
     * @var ProjectFactory
     */
    private ProjectFactory $factory;

    /**
     * Constructor.
     *
     * @todo Implement the project factory.
     *
     * @return void
     */
    public function __construct()
    {
        $this->factory = ProjectFactory::createInstance();
        // @todo Maybe make this configurable.
        $this->factory->addStrategy(new HookStrategy());
        $this->factory->addStrategy(new AddedHookStrategy());
    }

    /**
     * Parse all PHP files in a directory and return structured documentation data.
     *
     * @param string $directory The directory to parse.
     * @return array<string, array>
     */
    public function parseDirectory(string $directory): array
    {
        $files = $this->findPhpFiles($directory);
        if (empty($files)) {
            return [];
        }

        $localFiles = array_map(
            fn(string $path) => new LocalFile($path),
            $files
        );

        $project = $this->factory->create('parsed', $localFiles);
        $result = [];

        foreach ($project->getFiles() as $file) {
            $relativePath = $this->relativePath($file->getPath(), $directory);
            $result[$relativePath] = $this->exportFile($file);
        }

        return $result;
    }

    /**
     * Parse a single PHP file.
     *
     * @return array<string, mixed>
     */
    public function parseFile(string $filePath): array
    {
        $localFile = new LocalFile($filePath);
        $project = $this->factory->create('parsed', [$localFile]);
        $files = $project->getFiles();

        if (empty($files)) {
            return [];
        }

        return $this->exportFile(reset($files));
    }

    /**
     * Find PHP files in a directory.
     *
     * @param string $directory The directory to search.
     * @return string[]
     */
    private function findPhpFiles(string $directory): array
    {
        $files = [];
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($directory, RecursiveDirectoryIterator::SKIP_DOTS)
        );

        foreach ($iterator as $file) {
            if ($file->isFile() && $file->getExtension() === 'php') {
                $files[] = $file->getRealPath();
            }
        }

        sort($files);
        return $files;
    }

    /**
     * Export a PHP file to a structured array.
     *
     * @todo Use config file to determine which elements to export.
     * @todo Add WordPress specific elements to the export.
     *
     * @param PhpFile $file The PHP file to export.
     * @return array<string, mixed>
     */
    private function exportFile(PhpFile $file): array
    {
        $data = [
            'path' => $file->getPath(),
            'docblock' => $this->exportDocBlock($file->getDocBlock()),
            'includes' => $file->getIncludes(),
            'constants' => [],
            'functions' => [],
            'classes' => [],
            'interfaces' => [],
            'traits' => [],
            'enums' => [],
        ];

        foreach ($file->getConstants() as $constant) {
            $data['constants'][] = $this->exportConstant($constant);
        }

        foreach ($file->getFunctions() as $function) {
            $data['functions'][] = $this->exportFunction($function);
        }

        foreach ($file->getClasses() as $class) {
            $data['classes'][] = $this->exportClass($class);
        }

        foreach ($file->getInterfaces() as $interface) {
            $data['interfaces'][] = $this->exportInterface($interface);
        }

        foreach ($file->getTraits() as $trait) {
            $data['traits'][] = $this->exportTrait($trait);
        }

        foreach ($file->getEnums() as $enum) {
            $data['enums'][] = $this->exportEnum($enum);
        }

        return $data;
    }

    /**
     * Export a class to a structured array.
     *
     * @param Class_ $class The class to export.
     * @return array<string, mixed>
     */
    private function exportClass(Class_ $class): array
    {
        $data = [
            'name' => $class->getName(),
            'fqsen' => (string) $class->getFqsen(),
            'line' => $class->getLocation()->getLineNumber(),
            'end_line' => $class->getEndLocation()->getLineNumber(),
            'docblock' => $this->exportDocBlock($class->getDocBlock()),
            'final' => $class->isFinal(),
            'abstract' => $class->isAbstract(),
            'parent' => $class->getParent() ? (string) $class->getParent() : null,
            'interfaces' => array_map('strval', array_values($class->getInterfaces())),
            'traits' => array_map('strval', array_values($class->getUsedTraits())),
            'constants' => [],
            'properties' => [],
            'methods' => [],
        ];

        foreach ($class->getConstants() as $constant) {
            $data['constants'][] = $this->exportConstant($constant);
        }

        foreach ($class->getProperties() as $property) {
            $data['properties'][] = $this->exportProperty($property);
        }

        /**
         * FWIW this is the update to phpdocumentor/reflection I think v5+ ?? to get the hooks.
         */
        foreach ($class->getMethods() as $method) {
            $data['methods'][] = $this->exportMethod($method);
            foreach ($method->getMetadata() as $metadata) {
                if ($metadata instanceof Hook) {
                    if (! isset($data['hooks'][ $metadata->key() ])) {
                        $data['hooks'][ $metadata->key() ] = [];
                    }
                    $data['hooks'][ $metadata->key() ][] = $metadata->format();
                }
                if ($metadata instanceof AddedHook) {
                    if (! isset($data['added_hooks'][ $metadata->key() ])) {
                        $data['added_hooks'][ $metadata->key() ] = [];
                    }
                    $data['added_hooks'][ $metadata->key() ][] = $metadata->format();
                }
            }
        }

        return $data;
    }

    /**
     * Export an interface to a structured array.
     *
     * @param Interface_ $interface The interface to export.
     * @return array<string, mixed>
     */
    private function exportInterface(Interface_ $interface): array
    {
        $data = [
            'name' => $interface->getName(),
            'fqsen' => (string) $interface->getFqsen(),
            'line' => $interface->getLocation()->getLineNumber(),
            'end_line' => $interface->getEndLocation()->getLineNumber(),
            'docblock' => $this->exportDocBlock($interface->getDocBlock()),
            'parents' => array_map('strval', array_values($interface->getParents())),
            'constants' => [],
            'methods' => [],
        ];

        foreach ($interface->getConstants() as $constant) {
            $data['constants'][] = $this->exportConstant($constant);
        }

        foreach ($interface->getMethods() as $method) {
            $data['methods'][] = $this->exportMethod($method);
        }

        return $data;
    }

    /**
     * Export a trait to a structured array.
     *
     * @param Trait_ $trait The trait to export.
     * @return array<string, mixed>
     */
    private function exportTrait(Trait_ $trait): array
    {
        $data = [
            'name' => $trait->getName(),
            'fqsen' => (string) $trait->getFqsen(),
            'line' => $trait->getLocation()->getLineNumber(),
            'end_line' => $trait->getEndLocation()->getLineNumber(),
            'docblock' => $this->exportDocBlock($trait->getDocBlock()),
            'properties' => [],
            'methods' => [],
        ];

        foreach ($trait->getProperties() as $property) {
            $data['properties'][] = $this->exportProperty($property);
        }

        foreach ($trait->getMethods() as $method) {
            $data['methods'][] = $this->exportMethod($method);
        }

        return $data;
    }

    /**
     * Export an enum to a structured array.
     *
     * @param Enum_ $enum The enum to export.
     * @return array<string, mixed>
     */
    private function exportEnum(Enum_ $enum): array
    {
        $data = [
            'name' => $enum->getName(),
            'fqsen' => (string) $enum->getFqsen(),
            'line' => $enum->getLocation()->getLineNumber(),
            'end_line' => $enum->getEndLocation()->getLineNumber(),
            'docblock' => $this->exportDocBlock($enum->getDocBlock()),
            'backed_type' => $enum->getBackedType() ? (string) $enum->getBackedType() : null,
            'cases' => [],
            'methods' => [],
        ];

        foreach ($enum->getCases() as $case) {
            $data['cases'][] = [
                'name' => $case->getName(),
                'fqsen' => (string) $case->getFqsen(),
                'value' => ($v = $case->getValue(false)) !== null ? (string) $v : null,
            ];
        }

        foreach ($enum->getMethods() as $method) {
            $data['methods'][] = $this->exportMethod($method);
        }

        return $data;
    }

    /**
     * Export a function to a structured array.
     *
     * @param Function_ $function The function to export.
     * @return array<string, mixed>
     */
    private function exportFunction(Function_ $function): array
    {
        return [
            'name' => $function->getName(),
            'fqsen' => (string) $function->getFqsen(),
            'line' => $function->getLocation()->getLineNumber(),
            'end_line' => $function->getEndLocation()->getLineNumber(),
            'docblock' => $this->exportDocBlock($function->getDocBlock()),
            'return_type' => (string) $function->getReturnType(),
            'arguments' => $this->exportArguments($function->getArguments()),
        ];
    }

    /**
     * Export a method to a structured array.
     *
     * @param Method $method The method to export.
     * @return array<string, mixed>
     */
    private function exportMethod(Method $method): array
    {
        return [
            'name' => $method->getName(),
            'fqsen' => (string) $method->getFqsen(),
            'line' => $method->getLocation()->getLineNumber(),
            'end_line' => $method->getEndLocation()->getLineNumber(),
            'docblock' => $this->exportDocBlock($method->getDocBlock()),
            'abstract' => $method->isAbstract(),
            'final' => $method->isFinal(),
            'static' => $method->isStatic(),
            'visibility' => $method->getVisibility() ? (string) $method->getVisibility() : 'public',
            'return_type' => (string) $method->getReturnType(),
            'arguments' => $this->exportArguments($method->getArguments()),
        ];
    }

    /**
     * Export a property to a structured array.
     *
     * @param Property $property The property to export.
     * @return array<string, mixed>
     */
    private function exportProperty(Property $property): array
    {
        return [
            'name' => $property->getName(),
            'fqsen' => (string) $property->getFqsen(),
            'line' => $property->getLocation()->getLineNumber(),
            'docblock' => $this->exportDocBlock($property->getDocBlock()),
            'static' => $property->isStatic(),
            'visibility' => $property->getVisibility() ? (string) $property->getVisibility() : 'public',
            'type' => $property->getType() ? (string) $property->getType() : null,
            'default' => ($d = $property->getDefault(false)) !== null ? (string) $d : null,
        ];
    }

    /**
     * Export a constant to a structured array.
     *
     * @param Constant $constant The constant to export.
     * @return array<string, mixed>
     */
    private function exportConstant(Constant $constant): array
    {
        return [
            'name' => $constant->getName(),
            'fqsen' => (string) $constant->getFqsen(),
            'line' => $constant->getLocation()->getLineNumber(),
            'docblock' => $this->exportDocBlock($constant->getDocBlock()),
            'value' => ($v = $constant->getValue(false)) !== null ? (string) $v : null,
        ];
    }

    /**
     * Export arguments to a structured array.
     *
     * @param Argument[] $arguments
     * @return array<string, mixed>
     */
    private function exportArguments(array $arguments): array
    {
        return array_map(fn(Argument $arg) => [
            'name' => $arg->getName(),
            'type' => $arg->getType() ? (string) $arg->getType() : null,
            'default' => ($d = $arg->getDefault(false)) !== null ? (string) $d : null,
            'by_reference' => $arg->isByReference(),
            'variadic' => $arg->isVariadic(),
        ], array_values($arguments));
    }

    /**
     * Export a docblock to a structured array.
     *
     * @param DocBlock|null $docblock The docblock to export.
     * @return array<string, mixed>|null
     */
    private function exportDocBlock(?DocBlock $docblock): ?array
    {
        if ($docblock === null) {
            return null;
        }

        $tags = [];
        foreach ($docblock->getTags() as $tag) {
            $entry = [
                'name' => $tag->getName(),
                'description' => $tag->getDescription() ? (string) $tag->getDescription() : null,
            ];

            if ($tag instanceof Param) {
                $entry['variable'] = $tag->getVariableName();
                $entry['type'] = $tag->getType() ? (string) $tag->getType() : null;
            } elseif ($tag instanceof Return_) {
                $entry['type'] = $tag->getType() ? (string) $tag->getType() : null;
            }

            $tags[] = $entry;
        }

        return [
            'summary' => $docblock->getSummary(),
            'description' => (string) $docblock->getDescription(),
            'tags' => $tags,
        ];
    }

    /**
     * Get the relative path of a file.
     *
     * @param string $filePath The path to the file.
     * @param string $basePath The base path to compare against.
     * @return string
     */
    private function relativePath(string $filePath, string $basePath): string
    {
        $basePath = rtrim($basePath, '/') . '/';
        if (str_starts_with($filePath, $basePath)) {
            return substr($filePath, strlen($basePath));
        }
        return $filePath;
    }
}
