#!/bin/bash

docker buildx build -f Dockerfile.redis -t standalone-redis-image .
docker run -p 6379:6379 standalone-redis-image
