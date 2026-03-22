---
name: generate-static-docs
description: Generate the static documentation for a project.
disable-model-invocation: false
user-invocable: true
---

# Generate docs

Generate documentation using static analysis for PHP and JS files.

## Phase 1: Make sure the branch is up to date with `main`.

### 1a. Check for upstream changes

```bash
git pull origin main
```

Compare local HEAD against `origin/main`:

```bash
git rev-list --count HEAD..origin/main
```

If the count is greater than 0, run `git merge main`. If no, continue to step 2.

If there is a merge conflict or any errors, output the errors and exit.


### 1b. Verify required tools

Run all of these checks in parallel:

| Tool           | Check command            | Required version                                                                | Install command                              |
| -------------- | ------------------------ | ------------------------------------------------------------------------------- | -------------------------------------------- |
| Node.js        | `node --version`         | Must match major version in `.nvmrc`; mismatched versions break webpack builds  | `brew install nvm && nvm install && nvm use` |
| PHP            | `php --version`          | Read required version from `apps/wp-platform/composer.json` `require.php` field | `brew install php@<version>`                 |
| Composer       | `composer --version`     | Any v2                                                                          | `brew install composer`                      |

If any tool is missing or at the wrong version:

1. Report which tools are missing or outdated
2. Provide the specific install commands from the table above
3. Ask the user to install them and re-run the skill, or offer to run the brew commands

Do NOT proceed past this phase until all tools are verified.

## Phase 2: Ensure the project is built

Run these commands sequentially on the **repo root**.

```bash
nvm use
npm install
```

If there are any errors, stop at this point and tell the user. Do not go past this point if there are errors without further instruction.

## Phase 3: Create the static documentation

Run these from the **repo root**. Each step depends on the previous one succeeding.

### Phase 3a: Create the JS and PHP JSON files

```bash
npm run parse:js -- src/js documentation/static/js/json --pretty
./bin/block2docs parse src/php documentation/static/php/json --pretty
```

### Phase 3b: Create the JS and PHP static docs

```bash
npm run template:md -- documentation/static/php/json documentation/static/php/markdown
npm run template:md -- documentation/static/js/json documentation/static/js/markdown
```
