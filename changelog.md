# Changelog

## Unreleased (2026-03-22 13:16)

### Features

- Renamed project from `Block2Docs` to `Doc2Me` across all namespaces, configuration, and metadata
- Added new `bin/doc2me` executable as the renamed CLI entry point
- Added `FieldGuideTemplateCommand` class documentation with JSON and Markdown output
- Added `@needs-docs` tag to the `Hook` class constructor docblock
- Added `@todo` tag to `MarkdownTemplater` for planned config file support in `renderAll`
- Added `js-yaml` dev dependency for YAML parsing support
- Added `issues` include config with `needs-docs` and `todo` tags to parser config
- Added class-level docblock to `AddedHook` with summary, `@todo`, and `@since` tags

### Removed

- Removed legacy prompt templates: `describe-block`, `generate-docs`, and `summarize-function`
- Removed old `skills/example/` directory in favour of `.agents/skills/`
- Removed unused `Param` and `Return_` imports from `HookStrategy`

### Documentation changes

- Updated all PHP JSON documentation to reflect `Doc2Me` namespace rename
- Reformatted all PHP JSON documentation files to pretty-printed JSON for improved readability
- Updated `MarkdownTemplater` docs to reflect new include path and line number adjustments
- Updated `Hook` documentation with `Doc2Me` authorship and `@needs-docs` annotation
- Updated `AddedHook` documentation to include new class-level docblock metadata
- Updated README to reflect `Doc2Me` branding and new CLI command

### Configuration changes

- Renamed project to `doc2me` in parser config, schema, and composer autoload
- Updated repository URLs to `Doc2Me/Parser`
- Updated LICENSE copyright to `Doc2Me`
- Renamed phpcs ruleset and phpunit test suite to `Doc2Me`

### Skills changes

- Updated `generate-docs` skill to use `git merge origin/main` instead of `git merge main`
- Updated `generate-static-docs` skill to use `git merge origin/main` instead of `git merge main`
- Added `create-changelog` skill for generating changelogs from branch diffs with configurable audience and template support
- Added `generate-static-docs` skill for static documentation generation via PHP and JS parsers
- Added `create-issues` skill for creating GitHub issues from code tags with diff-based detection

### Executables

- Added `bin/doc2me` as the new CLI entry point with `parse`, `generate-docs`, and `field-guide-template` commands
- Updated `bin/block2docs` to use `Doc2Me` namespaces
