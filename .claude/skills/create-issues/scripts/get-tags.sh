#!/usr/bin/env bash
# Reads unified diff from stdin, extracts only truly new tags.
# Tags that appear in both removed (-) and added (+) lines are excluded,
# since they already existed and were just reformatted.
# Handles both minified and pretty-printed JSON.
# Output: JSON array of { "name": "...", "description": "..." } objects.

input=$(cat)

# Extract name/description pairs from a stream of text.
# Normalises both minified and pretty-printed JSON into one-pair-per-line.
extract_pairs() {
  # Put every "name" and "description" key on its own line, then pair them.
  sed 's/"name"/\n"name"/g; s/"description"/\n"description"/g' \
  | awk '
    /"name":/ {
      line = $0
      gsub(/.*"name":[[:space:]]*"/, "", line)
      gsub(/".*/, "", line)
      name = line
    }
    /"description":/ && name != "" {
      line = $0
      gsub(/.*"description":[[:space:]]*"/, "", line)
      gsub(/".*/, "", line)
      print name "\t" line
      name = ""
    }
  '
}

# Get pairs from removed lines
removed=$(echo "$input" | grep '^-' | grep -v '^---' | sed 's/^-//' | extract_pairs | sort)

# Get pairs from added lines
added=$(echo "$input" | grep '^+' | grep -v '^+++' | sed 's/^+//' | extract_pairs | sort)

# Find only truly new pairs (in added but not in removed).
# comm -23 outputs lines only in the first file.
new_pairs=$(comm -23 <(echo "$added") <(echo "$removed"))

# Output as JSON array
echo "$new_pairs" | awk -F'\t' '
  BEGIN { printf "[" }
  NF >= 1 && $1 != "" {
    if (count++) printf ","
    printf "{\"name\":\"%s\",\"description\":\"%s\"}", $1, $2
  }
  END { printf "]\n" }
'
