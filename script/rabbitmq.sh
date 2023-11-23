#!/bin/bash

docker buildx build -f Dockerfile.rabbitmq -t standalone-rabbitmq-image .
docker run -p 5672:5672 -p 15672:15672 standalone-rabbitmq-image
