---
name: create-github-issues
description: Create issues on Github from a set of defined tags.
disable-model-invocation: true
user-invocable: true
---
# Create Github issues

Creates issues from a set of given tags which have been added to the code.

## Step 1. Verify required tools

Check tha the Github CLI is enabled.

```bash
gh --version
gh auth status
```

If the user is not logged in, prompt the user to exit Claude and log in.

Do NOT proceed past this phase until the user is authenticated with the Github CLI.

## Step 2: Get repository issues config

### Step 1a: Read the config file

Read `default.parser-config.yml` and find the `issues` entry in `sources`. Use this as the config.

### Step 1b: Check the issues creation is enabled

If the issues config `enabled` is `false`, tell the user the issues creation is not enabled and ask for instructions. Do not proceed.

The default is `true`.

### Step 1c: Get the tags to create issues from

If there is no config, use these defaults for `tags`: ["needs-docs", "todo"]

The `tags` to create issues for are in `include`.

- Ask the user if the tag list is correct.
- Allow the user to change the tags

## Step 2: Make sure the documentation has been generated

Ask the user if you should use `/generate-static-docs` to ensure the project is built and generate the up to date documentation.

## Step 3: Find the tags which have been newly added

Use `./scripts/get-tags.sh` to find the tags in the `tags` config.
ONLY use tags present in this diff:

```bash
git diff main documentation/static/**/json
```

ONLY get tags which are being added.
Do NOT read more files to get more tags.

Each tag object should have the schema:

```json
{
	"type": "object",
	"properties": {
		"name": { "type": "string" },
		"description": { "type": "string" }
	}
}
```

After you have the array, remove any tags which are not present in the `documentation/static/**/json` diff to `main`

Do NOT create Github issues or offer to create Github issues in this step.


### Step 3a: Confirm tags to include

Print the `tags` array of objects to create issues from to the screen.
Ask the user to confirm that the array is correct and allow the user to add or remove objects.

## Create the GitHub issues

Do NOT create any issue without explicit confirmation from the user.

Use the template in `references/github-create-issue.md` to create commands for each included `tag`.

For each command, ask the user if the issue is correct.
Ask the user to confirm or edit each field
Do not run the command without confirmation


## References

- Get newly added tags: `scripts/get-tags.sh`

