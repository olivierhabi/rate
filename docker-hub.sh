#!/bin/bash

# Your Docker Hub username
docker_hub_username="walterolivier"

# Network name
network_name="walterolivier"

# Docker image names
app_image="rate-limiter-backend-app"
redis_image="rate-limiter-backend-redis"
postgres_image="rate-limiter-backend-postgres"
rabbitmq_image="rate-limiter-backend-rabbitmq"
worker_image="rate-limiter-backend-worker"

# Build and push the containers
echo "Building and pushing Docker images to Docker Hub..."
docker buildx build -f Dockerfile.app -t $docker_hub_username/$app_image .
docker push $docker_hub_username/$app_image

docker buildx build -f Dockerfile.redis -t $docker_hub_username/$redis_image .
docker push $docker_hub_username/$redis_image

docker buildx build -f Dockerfile.postgres -t $docker_hub_username/$postgres_image .
docker push $docker_hub_username/$postgres_image

docker buildx build -f Dockerfile.rabbitmq -t $docker_hub_username/$rabbitmq_image .
docker push $docker_hub_username/$rabbitmq_image

bash ./worker/worker.sh && docker buildx build -f ./worker/Dockerfile.worker -t $docker_hub_username/$worker_image .
docker push $docker_hub_username/$worker_image
