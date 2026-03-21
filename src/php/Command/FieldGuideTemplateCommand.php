<?php

namespace Block2Docs\Command;

class FieldGuideTemplateCommand
{
    public function execute(array $args): void
    {
        $template = <<<'MD'
# {{project_name}} Field Guide

Version: {{version}}
Release date: {{release_date}}

## Highlights

{{highlights_tldr}}

## Breaking Changes

- {{breaking_change_1}}

## New Features

- {{new_feature_1}}

## Enhancements

- {{enhancement_1}}

## Bug Fixes

- {{bug_fix_1}}

## Performance

- {{performance_note_1}}

## Security

- {{security_note_1}}

## Developer Notes

- {{developer_note_1}}

## Upgrade Notes

### Migration Steps

1. {{migration_step_1}}
2. {{migration_step_2}}

## Props and Contributors

- {{contributor_or_team_1}}

## Appendix

- Milestone: {{milestone_link}}
- PR list: {{pull_request_list_link}}
- Changelog: {{changelog_link}}

MD;

        $outputPath = $args[0] ?? null;

        if ($outputPath === null || $outputPath === '') {
            echo $template . "\n";
            return;
        }

        $written = @file_put_contents($outputPath, $template . "\n");
        if ($written === false) {
            fwrite(STDERR, "Failed to write template to: {$outputPath}\n");
            return;
        }

        echo "Field guide template written to {$outputPath}\n";
    }
}
