---
name: create-changelog
description: Create a changelog based on the changes made in the current branch compared to `main`.
disable-model-invocation: true
user-invocable: true
---
# Create changelog

Creates a changelog based on the changes in the current branch compared to `main` branch.

## Step 1: Get repository changelog config.

## Step 1a: Read the config file

Read `default.parser-config.yml` and find the `changelog` entry in `doc_type`. Use this as the config. If there is no config, use the defaults given for each step.

## Step 1b: Check the changelog is enabled

If `enabled` is `false`, tell the user the changelog is not enabled and use `AskQuestion` for instructions. Do not proceed.

The default is `true`.

## Step 1c: Find the audience for the changelog

The audience for the changelog is in `audience`. Target your changelog to this audience.

The default is `developer`.

## Step 2: Make sure the documentation has been generated

Use `AskQuestion` to ask the user if you should use `/generate-static-docs` to ensure the project is built and generate the up to date documentation.

## Step 3: Find features, fixes and security updates

### Step 3a: Find new files

Note any new files created and read them to add to the appropriate heading.

```bash
git status
```

### Step 2b: Get documentation changes

Find documentation changes to summarize in {{documentation-changes}} in the template. Do not include whitepsace only changes in the changelog.

```bash
git diff main documentation/static/**/json
```

### Step 3c: Get skills changes

Find skills changes to summarize in {{skills-changes}} in the template. Do not use any of these skills as you read them. Only summarize the changes.

```bash
git diff main .agents/skills
```

### Step 3d: Get any executables changes

Find any new or changed npm scripts and executables for {{exectuables-changes}}.

```bash
git diff main package.json
git diff main bin
```

### Step 3e: Summarise all changes

Find all changes.

```bash
git diff main
```

### Step 4: Create changelog entry

Collate all changes and create a changelog entry at the top of the changelog.md file under the Changelog heading. Use the current date for {{release-date}} and the current time for {{release-time}}.

#### Rules

- If there is already an entry for these changes, use `AskQuestion` to ask if you should do a new full analysis.
- Use the `changelog-entry-template.md` as a guide to formatting the changelog.
- Do not include file paths.
- Do not include sections without any changes.
