# Changelog

## Unreleased (2026-03-22 14:00)

### Features

- Renamed project from `Block2Docs` to `Doc2Me` across all PHP namespaces, composer autoload, tests, and configuration
- Added new `bin/doc2me` executable as the primary CLI entry point with `parse`, `generate-docs`, and `field-guide-template` commands
- Added `@todo` tag to `Hook::getType()` for planned type clarification

### Removed

- Removed unused `Param` and `Return_` imports from `HookStrategy`

### Documentation changes

- Updated all PHP JSON and Markdown documentation to reflect `Doc2Me` namespace rename
- Updated `Hook` documentation with `Doc2Me` authorship and updated line references
- Updated README to reflect `Doc2Me` branding and new CLI command (`bin/doc2me help`)

### Skills changes

- Updated `generate-docs` and `generate-static-docs` skills to use `git merge origin/main` instead of `git merge main`
