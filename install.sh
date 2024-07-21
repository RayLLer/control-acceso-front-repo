#!/usr/bin/env bash

export NAME=${1:?}
export DOCKER_IMAGE=${2:?}
export FRONT_PORT=${3:?}
export BACKEND_HOST=${4:?}
export BACKEND_PORT=${5:?}
export NETWORK=${6:?}

docker-compose -f front.yml config > docker-compose.yml
docker-compose -p ${NAME} down
docker-compose -p ${NAME} up -d --remove-orphans