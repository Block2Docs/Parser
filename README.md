# Block2Docs Parser
[CloudFest Hackathon 2026 project](https://hackathon.cloudfest.com/project/block2docs/)

## Objective

Block2Docs is a tool that bridges the gap between code and documentation by intelligent DocBlock parsing. It reads annotations from your code to identify what needs documentation, and routes everything to the appropriate output—changelog entries, GitHub issues, API references, field guides, and more.

### Parser/Workflow engine

The core parser scans PHP/JavaScript code, extracting DocBlocks and documentation, and needs to:
- Generate API Docs: Create structured API documentation from inline comments.
- Generate Changelogs: Extract version history from @since and @changelog tags.
- Structure Field Guides: Automatically build release documentation frameworks.
- Create GitHub Issues: Generate issues for items tagged @needs-docs, routed by doc type (dev note, end-user guide, how-to, tutorial).

### Flexible Configuration

- Config-driven: Use YAML/JSON for easy project customization.
- Template System: Extensible templates; override defaults or create new ones.
- Language Agnostic: Starts with PHP/JavaScript; architecture supports future languages.
- CI/CD Ready: Integrates into existing development pipelines.

## CLI

From the repository root, install dependencies and run the `block2docs` entrypoint:

```bash
composer install
./bin/block2docs help
```

If the script is not executable on your system, invoke PHP explicitly:

```bash
php bin/block2docs help
```

Commands:

- `parse` — run the parser (see `Block2Docs\Command\ParseCommand`).
- `generate-docs` or `docs` — documentation generation (`GenerateDocsCommand`).

### `parse`

Parse PHP files in a directory and output structured JSON containing all classes, interfaces, traits, enums, functions, constants, methods, properties, and their docblocks.

```bash
./bin/block2docs parse <directory> [output-file] [--pretty]
```

| Argument | Description |
|---|---|
| `<directory>` | Path to the directory to scan (required). All `.php` files are found recursively. |
| `[output-file]` | Optional file path to write JSON output to. If omitted, JSON is printed to stdout. |
| `--pretty` | Pretty-print the JSON output. |

Examples:

```bash
# Parse a directory and print JSON to stdout
./bin/block2docs parse src/

# Parse with pretty-printed output
./bin/block2docs parse src/ --pretty

# Write output to a file
./bin/block2docs parse src/ output/parsed.json --pretty
```

The output is a JSON object keyed by relative file path. Each file entry contains:

```json
{
  "path": "/absolute/path/to/file.php",
  "docblock": { "summary": "...", "description": "...", "tags": [...] },
  "includes": [],
  "constants": [],
  "functions": [],
  "classes": [],
  "interfaces": [],
  "traits": [],
  "enums": []
}
```

Classes, functions, and methods include their arguments, return types, visibility, and full docblock data (summary, description, and tags such as `@param`, `@return`, `@since`, `@deprecated`).

### `generate-docs`

```bash
./bin/block2docs generate-docs
```

When this package is required as a Composer dependency in another project, Composer exposes the same binary as `vendor/bin/block2docs` (after `composer install` there).

## Hackathon Goals
1. Develop a working CLI to parse PHP/JS annotations, extracting structured DocBlock data for documented and undocumented code.
2. Implement automated changelog generation using @since and @changelog tags, with fallback to git history for untagged changes.
3. Create a GitHub issue workflow for @needs-docs items that generates templated issues for documentation requirements (dev, user, guide).
4. Design a flexible configuration system for customizing parsing, output, and templates.
5. Produce a compelling demo on a real codebase (e.g., WordPress plugin), showcasing the full scanning-to-documentation/issue pipeline.


## The Documentation System

![docs-system](https://github.com/user-attachments/assets/3dd7f16d-164b-4458-8062-6c8be75da83a)

## The team

## Contributing

### Agent skills (Cursor)

The repo includes an example layout under [`skills/example/`](skills/example/): a root `SKILL.md` plus a `references/` folder for optional supporting material. Copy or adapt it when adding project-specific Cursor agent skills; fill in `SKILL.md` with instructions the agent should follow.

## License

### Acknowledegments

The PHP parser is taken from [wordpress/phpdoc-parser](https://github.com/WordPress/phpdoc-parser).

