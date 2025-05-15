#!/bin/bash

# Load environment variables
source .env

# Define variables
version=$(grep -oP '(?<="version": ")[^"]*' "$PUBLIC_DIR/manifest.json")
extension_name="course_registration_assistant"
filename="$extension_name-$version"
release_dir="$DEST_DIR/v$version"

echo "Version $version is being published..."

# Update Version Globally
# Caution: This will change every version-like string in these files.
sed -i "s/[0-9]\+\.[0-9]\+\.[0-9]\+/$version/g" $DEST_DIR/updates.*
sed -i "3s/[0-9]\+\.[0-9]\+\.[0-9]\+/$version/" ./package.json
sed -i "s/[0-9]\+\.[0-9]\+\.[0-9]\+/$version/g" $README_PATH
echo "All files' versions are updated successfully."

# Format and build
pnpm format
pnpm build

# Prepare the release directory
cd $DEST_DIR
mkdir v$version
rm $extension_name-*.crx
cd ..

# Create Chrome zip file
web-ext build --artifacts-dir=$release_dir \
    --filename="$filename.zip" \
    --source-dir=$BUILD_DIR \
    --no-config-discovery \
    --overwrite-dest

# Create and Sign Chrome crx file
crx pack $BUILD_DIR -p $PRIVATE_KEY_PATH -o "$DEST_DIR/$filename.crx"

echo "Chrome extension ${filename} is published successfully."

# Create and Sign Firefox xpi file
web-ext sign --api-key=$AMO_JWT_ISSUER \
    --api-secret=$AMO_JWT_SECRET \
    --artifacts-dir=$release_dir \
    --source-dir=$BUILD_DIR \
    --no-config-discovery \
    --channel=unlisted
mv $release_dir/*.xpi $release_dir/$filename.xpi

echo "Firefox extension ${filename} is published successfully."