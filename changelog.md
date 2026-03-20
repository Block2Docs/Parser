# Changelog

## Unreleased

### Added

- **Example agent skill layout** (`skills/example/`): Placeholder `SKILL.md` and `references/` directory for Cursor-style agent skills.
- **Project scaffolding**: Composer package (`cloudfest/documentation`) with PSR-4 autoloading for the `Block2Docs` namespace.
- **CLI entrypoint** (`bin/block2docs`): Dispatches `parse` and `generate-docs` commands.
- **Parser classes**: `BlockParser` and `PhpFileParser` stubs for extracting block metadata and PHP source structures.
- **AI integration**: `PromptBuilder` for mustache-style template rendering and `Client` stub for provider-agnostic AI completions.
- **Command classes**: `ParseCommand` and `GenerateDocsCommand` stubs wired into the CLI.
- **Prompt templates**: `describe-block`, `generate-docs`, and `summarize-function` templates in `prompts/`.
- **Default configuration** (`config/default.json`): Pre-configured for Anthropic Claude with markdown output.
- **PHP linting**: PHP_CodeSniffer with PSR-12 standard via `composer lint:php` / `composer lint:php:fix`.
- **JS linting**: ESLint v10 (flat config, recommended rules) via `npm run lint:js` / `npm run lint:js:fix`.
- **Unified lint commands**: `npm run lint` runs both JS and PHP linters; `npm run lint:fix` auto-fixes both.
- **PHPUnit testing**: PHPUnit v11 with test suite in `tests/php/`, runnable via `composer test`.
  - `PromptBuilderTest`: Verifies template variable substitution and static template rendering.
  - `BlockParserTest`, `PhpFileParserTest`, `ClientTest`: Baseline tests for stub classes.
- **README**: CLI usage, documentation system overview, and Contributing notes for the example `skills/example/` agent skill layout.
- **`.gitignore`**: Excludes `vendor/`, `node_modules/`, and `.phpunit.cache/`.
