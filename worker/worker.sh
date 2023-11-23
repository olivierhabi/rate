# #!/bin/bash

# Define the parent directory
parent_dir="."

# Ensure target directories exist
mkdir -p ./prisma worker/src/service/ worker/src/helpers

# Copy the .env file
cp ".env" worker/ || echo "Error: .env not found in parent directory."

# Copy the prisma folder
cp -r "prisma" worker/ || echo "Error: prisma folder not found in parent directory."

# Copy the email service and prisma client files
cp "./src/service/email.js" worker/src/service/ || echo "Error: email.js not found in parent directory."
cp "./src/helpers/prismaClient.js" worker/src/helpers/ || echo "Error: prismaClient.js not found in parent directory."
