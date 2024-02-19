#!/bin/bash

# Load environment variables
source .env

# Define variables
extension_name="course_registeration_assistant"
version=$(grep -oP '(?<="version": ")[^"]*' "$BUILD_DIR/manifest.json")
firefox_xpi_filename="${extension_name}-${version}.xpi"
chrome_zip_filename="${extension_name}-${version}.zip"

echo "Version ${version} is being published..."

# Create Chrome zip file
web-ext build --overwrite-dest \
    --artifacts-dir=$DEST_DIR \
    --source-dir=$BUILD_DIR
echo "${chrome_zip_filename} is published successfully."

# Create and Sign Firefox xpi file
web-ext sign --api-key=$AMO_JWT_ISSUER \
 --api-secret=$AMO_JWT_SECRET \
 --artifacts-dir=$DEST_DIR \
 --source-dir=$BUILD_DIR \
 --channel=unlisted
echo "${firefox_xpi_filename} is published successfully."

# Update Readme File
sed -i "s/${extension_name}-[0-9].[0-9].[0-9]/${extension_name}-${version}/g" $README_PATH
echo "README file is updated successfully."