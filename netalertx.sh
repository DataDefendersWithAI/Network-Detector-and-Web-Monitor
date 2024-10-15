#!/bin/zsh

# This script will run below command: docker run -d --rm --network=host \
#   -v local/path/config:/app/config \
#   -v local/path/db:/app/db \
#   -e TZ=Europe/Berlin \
#   -e PORT=20211 \
#   jokobsk/netalertx:latest

# Check if the container is already running
if [ "$(docker ps -q -f name=netalertx)" ]; then
  echo "Container is already running"
  exit 0
fi

# Check if the container is stopped
if [ "$(docker ps -aq -f status=exited -f name=netalertx)" ]; then
  echo "Container is stopped, removing it"
  docker rm netalertx
fi

# Check if the image exists
if [ "$(docker images -q jokobsk/netalertx:latest)" ]; then
  echo "Image exists"
else
  echo "Image does not exist, pulling it"
  docker pull jokobsk/netalertx:latest
fi

# Run the container
docker run -d --rm --network host \
  -v config:/app/config \
  -v db:/app/db \
  -e TZ=Asia/Bangkok \
  -e PORT=8888 \
  --name netalertx \
  jokobsk/netalertx:latest

# Open browser
open http://localhost:8888