# Changelog

## Unreleased (2026-03-22)

### Features

- Added documentation for the `FieldGuideTemplateCommand` class with JSON and Markdown output
- Added new skills: `create-changelog`, `generate-docs`, and `example` under `.agents/skills/`
- Added `js-yaml` dev dependency for YAML parsing support

### Removed

- Removed legacy prompt templates: `describe-block`, `generate-docs`, and `summarize-function`
- Removed old `skills/example/` directory in favour of `.agents/skills/`

### Documentation changes

- Reformatted all PHP JSON documentation files to pretty-printed JSON for improved readability
- Updated `MarkdownTemplater` docs to reflect new include path and line number adjustments
- Updated `Hook` reassurance message

### Skills changes

- Added `create-changelog` skill for generating changelogs from branch diffs with configurable audience and template support
- Added `generate-docs` skill for static documentation generation
- Added `example` skill as a reference template for new skills
