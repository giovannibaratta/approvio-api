#!/bin/bash

TARGET_DIR="generated/openapi/model"
INDEX_FILE="$TARGET_DIR/index.ts"

# Ensure the target directory exists
if [ ! -d "$TARGET_DIR" ]; then
  echo "Error: Directory '$TARGET_DIR' not found."
  exit 1
fi

# Create or truncate the index.ts file
echo "// Auto-generated index file" > "$INDEX_FILE"
echo "" >> "$INDEX_FILE"

# Find all .ts files in the target directory (excluding index.ts itself)
# and generate export statements
find "$TARGET_DIR" -maxdepth 1 -type f -name "*.ts" -not -name "index.ts" | while read -r file; do
  # Get the basename of the file (e.g., MyModel.ts)
  filename=$(basename "$file")
  # Remove the .ts extension (e.g., MyModel)
  module_name="${filename%.ts}"
  # Append the export statement to index.ts
  echo "export * from './$module_name';" >> "$INDEX_FILE"
done

echo "Successfully generated '$INDEX_FILE'"