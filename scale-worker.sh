echo "Running Docker scaling worker containers..."
docker compose up --scale worker=1 -d