#!/bin/bash

docker buildx build -f Dockerfile.app -t standalone-app-image .
docker run -p 3000:3000 standalone-app-image
