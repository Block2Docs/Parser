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

## License 
