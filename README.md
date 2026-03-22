# Doc2Me Parser
[CloudFest Hackathon 2026 project](https://hackathon.cloudfest.com/project/doc2me/)

## Objective

Doc2Me will be a tool that bridges the gap between code and documentation by intelligent DocBlock parsing. It reads annotations from your code to identify what needs documentation, and routes everything to the appropriate output—changelog entries, GitHub issues, API references, field guides, and more.

## TLDR: How to use

This is an example of a documentation workflow. It generates PHP and JS docs from static analysis and also introduces skills for AI agents.

### Skills for AI agents:

- `generate-static-docs`: This generates JSON files from the js and php parser output then uses those to create code documentation. This skill is used in `create-changelog` and `create-github-issues`. Generally this does not need to be run separately.
- `create-changelog`: This generates a changelog entry from the changes from the `main` branch. It uses the static analysis as well as contextual clues from the diff.
- `create-github-issues`: This creates github issues from any new tags defined in the YAML config, eg "todo" and "needs-docs".

### CLI only commands:

Currently you can generate the static code documentation via CLI. The skills use these commands which should be run in order:

1. Generate JSON files with the results of static analysis:

- for php files: `bin/doc2me parse [input directory] [output directory] --pretty` scans the directory in the input directory for php files and does the static analysis, saving the output to the output directory. The `--pretty` flag pretty prints the JSON object.
- for js files: `npm run parse:js [input directory] [output directory] --pretty` does much the same thing as the above command but for php files.

2. Generate the markdown files for human readable code documentation.

- for all the output files use: `npm run template:md -- [input directory] [output directory]` outputs the markdown files from the JSON files in input directory to output directory.

## The Documentation System

![docs-system](https://github.com/user-attachments/assets/3dd7f16d-164b-4458-8062-6c8be75da83a)

### Parser/Workflow engine

The core static parsers scan PHP/JavaScript code, extracting DocBlocks and documentation, and needs to:

- Generate API Docs: Create structured API documentation from inline comments.
- Generate Changelogs: Extract version history from git diffs.
- Structure Field Guides: Automatically build release documentation frameworks.
- Create GitHub Issues: Generate issues for items with configurable tags.

### Flexible Configuration

- Config-driven: Use YAML for easy project customization.
- Template System: Starts with set templates; plans for configurable templates and overrides.
- Language Agnostic: Starts with PHP/JavaScript; architecture supports future languages.
- CI/CD: Could be integrated into existing development pipelines.


## Local setup

Install node and php dependencies:

```bash
npm install
```

## CLI

### PHP

From the repository root, install dependencies and run the `doc2me` entrypoint:

```bash
bin/doc2me help
```

If the script is not executable on your system, invoke PHP explicitly:

```bash
php bin/doc2me help
```

#### Commands:

- `parse` — run the parser (see `Doc2Me\Command\ParseCommand`).

Parse PHP files in a directory and output structured JSON containing all classes, interfaces, traits, enums, functions, constants, methods, properties, and their docblocks.

```bash
./bin/doc2me parse <directory> [output-dir] [--pretty]
```

| Argument | Description |
|---|---|
| `<directory>` | Path to the directory to scan (required). All `.php` files are found recursively. |
| `[output-dir]` | Optional directory to write JSON output files to. One file is created per parsed source file, named `<filename>Docs.json` (e.g., `SampleClass.php` produces `SampleClassDocs.json`). If omitted, all results are printed to stdout as a single JSON object. |
| `--pretty` | Pretty-print the JSON output. |

Examples:

```bash
# Parse a directory and print JSON to stdout
./bin/doc2me parse src/

# Parse with pretty-printed output
./bin/doc2me parse src/ --pretty

# Write one JSON file per source file to a directory
./bin/doc2me parse src/ output/ --pretty
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
  "enums": [],
  "methods": []
}
```

Classes, functions, and methods include their arguments, return types, visibility, and full docblock data (summary, description, and tags such as `@param`, `@return`, `@since`, `@deprecated`).

- `field-guide-template` — Generate the Field Guide Template and save to the output file.

Parse PHP files in a directory and output structured JSON containing all classes, interfaces, traits, enums, functions, constants, methods, properties, and their docblocks.

```bash
./bin/doc2me field-guid [output-path]
```

| Argument | Description |
|---|---|
| `[output-path]` | The file path to write the Field Guide Template to. |

Examples:

```bash
# Parse a directory and print JSON to stdout
./bin/doc2me field-guide FIELD_GUIDE_TEMPLATE.md
```


### JS static parser

Parse JavaScript files in a directory using the JSDoc parser and output structured JSON. This mirrors the PHP `parse` command but for `.js` files with JSDoc annotations.

```bash
npm run parse:js -- <directory> [output-dir] [--pretty]
```

| Argument | Description |
|---|---|
| `<directory>` | Path to the directory to scan (required). All `.js` files are found recursively. |
| `[output-dir]` | Optional directory to write JSON output files to. One file is created per parsed source file, named `<filename>Docs.json` (e.g., `SampleClass.js` produces `SampleClassDocs.json`). If omitted, all results are printed to stdout as a single JSON object. |
| `--pretty` | Pretty-print the JSON output. |

Examples:

```bash
# Parse a directory and print JSON to stdout
npm run parse:js -- src/js/cli src/

# Parse with pretty-printed output
npm run parse:js -- src/js/cli src/ --pretty
```

The output shape matches the PHP parser:

```json
{
  "path": "/absolute/path/to/file.js",
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

Classes include `properties`, `methods`. Methods and functions include `arguments`, `return_type`, `visibility`, full docblock data parsed from JSDoc annotations (`@param`, `@return`, `@since`, `@deprecated`, etc.) and WordPress hook data (`hooks`, `added_hooks`).

The parser detects WordPress hook calls (`doAction`, `applyFilters`, `addAction`, `addFilter`) in both bare and `wp.hooks.*` member-expression forms.

**Running tests:**

```bash
npm test
```

### Generating Markdown files from static site analysis

Generate human-readable Markdown documentation from the JSON output of either parser.

```bash
npm run template:md -- <input-dir> [output-dir]
```

| Argument | Description |
|---|---|
| `<input-dir>` | Directory containing parser JSON output files (required). All `.json` files in the directory are processed. |
| `[output-dir]` | Directory to write `.md` files to. If omitted, Markdown is printed to stdout. |

Examples:

```bash
# Parse JS, then generate Markdown docs
npm run template:md -- src/ documentation/ --pretty
```

The generated Markdown includes class descriptions, constants, properties, methods (with signatures, parameters, return types, visibility), and WordPress hooks. Special tags are rendered as callouts:

- `@deprecated` — displayed as a warning blockquote
- `@needs-docs` — displayed as a documentation-needed callout

## Hackathon Goals

1. Develop a working CLI to parse PHP/JS annotations, extracting structured DocBlock data for documented and undocumented code.
2. Implement automated changelog generation using @since and @changelog tags, with fallback to git history for untagged changes.
3. Create a GitHub issue workflow for @needs-docs items that generates templated issues for documentation requirements (dev, user, guide).
4. Design a flexible configuration system for customizing parsing, output, and templates.
5. Produce a compelling demo on a real codebase (e.g., WordPress plugin), showcasing the full scanning-to-documentation/issue pipeline.

## The team

## Contributing

### Agent skills (Cursor)

The repo includes an example layout under [`skills/example/`](skills/example/): a root `SKILL.md` plus a `references/` folder for optional supporting material. Copy or adapt it when adding project-specific Cursor agent skills; fill in `SKILL.md` with instructions the agent should follow.

## License

### Acknowledegments

The PHP parser is taken from [wordpress/phpdoc-parser](https://github.com/WordPress/phpdoc-parser).

