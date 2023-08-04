#!/bin/bash

# Step 1: Check if 'queue' folder exists and is not empty
if [ -d "_queue" ] && [ -n "$(ls -A _queue)" ]; then
  # Step 2: Move markdown files to 'posts' folder and rename them
  for file in _queue/*.md; do
    if [ -f "$file" ]; then
      FILE_NAME=$(basename "$file" .md)
      NEW_FILENAME=$(date +%Y-%m-%d-"$FILE_NAME".md)
      mv "$file" "_posts/$NEW_FILENAME"
    fi
  done
fi
