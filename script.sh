#!/bin/bash

# Network name
network_name="rate_limiter_network"

# Docker image names
app_image="rate-limiter-backend-app"
redis_image="rate-limiter-backend-redis"
postgres_image="rate-limiter-backend-postgres"
rabbitmq_image="rate-limiter-backend-rabbitmq"
worker_image="rate-limiter-backend-worker"

# Check if the network exists and remove it
if [[ $(docker network ls -q -f name=$network_name) ]]; then
    echo "Removing existing Docker network: $network_name"
    docker network rm $network_name
fi

# Check if the images exist and remove them
for image in $app_image $redis_image $postgres_image $rabbitmq_image $worker_image; do
    if [[ $(docker images -q $image) ]]; then
        echo "Removing existing Docker image: $image"
        docker rmi $image
    fi
done

# Create the network
echo "Creating Docker network: $network_name"
docker network create $network_name

# Build the containers
echo "Building Docker images..."
docker buildx build -f Dockerfile.app -t $app_image .
docker buildx build -f Dockerfile.redis -t $redis_image .
docker buildx build -f Dockerfile.postgres -t $postgres_image .
docker buildx build -f Dockerfile.rabbitmq -t $rabbitmq_image .
bash ./worker/worker.sh && docker buildx build -f ./worker/Dockerfile.worker -t $worker_image .

# Run the containers
echo "Running Docker containers..."
docker run -d --network $network_name --name redis $redis_image
docker run -d --network $network_name --name rabbitmq $rabbitmq_image
docker run -d --network $network_name -p 3000:3000 --name rate_limiter_app $app_image
docker run -d --network $network_name --name postgres -p 5432:5432 $postgres_image
docker run -d --network $network_name --name worker $worker_image

echo "Containers are up and running."

sleep 10

# Run migration
docker exec rate_limiter_app yarn run db:push
docker exec rate_limiter_app yarn run seed
