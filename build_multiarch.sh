#!/bin/sh

docker build -t mixermachine/mad-test-workload:latest-arm64v8 --build-arg ARCH=arm64v8/ .
docker build -t mixermachine/mad-test-workload:latest-amd64 --build-arg ARCH=amd64/ .

docker push mixermachine/mad-test-workload:latest-arm64v8
docker push mixermachine/mad-test-workload:latest-amd64

docker manifest create mixermachine/mad-test-workload:latest \
  --amend mixermachine/mad-test-workload:latest-arm64v8 \
  --amend mixermachine/mad-test-workload:latest-arm64v8
