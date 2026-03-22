# Changelog

## Unreleased (2026-03-22 11:29)

### Features

- Added documentation for the `FieldGuideTemplateCommand` class with JSON and Markdown output
- Added `@needs-docs` tag to the `Hook` class docblock
- Added `js-yaml` dev dependency for YAML parsing support
- Added `issues` include config with `needs-docs` and `todo` tags to parser config

### Removed

- Removed legacy prompt templates: `describe-block`, `generate-docs`, and `summarize-function`
- Removed old `skills/example/` directory in favour of `.agents/skills/`

### Documentation changes

- Reformatted all PHP JSON documentation files to pretty-printed JSON for improved readability
- Updated `MarkdownTemplater` docs to reflect new include path and line number adjustments
- Updated `Hook` reassurance messages
- Added new reassurance messages to config

### Skills changes

- Added `create-changelog` skill for generating changelogs from branch diffs with configurable audience and template support
- Added `generate-docs` skill for static documentation generation
- Added `create-issues` skill for creating GitHub issues from code tags with diff-based detection
- Added `example` skill as a reference template for new skills
