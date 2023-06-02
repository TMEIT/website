#! /bin/bash

# NOTE: Read the installation guide in docs/howto-dev.md to make sure you have all prerequisites installed before running this script.
# That documentation also better explains how to use tilt.

echo Installing Database software into the Kubernetes cluster...
kubectl apply -f deploy/kubernetes/tmeit-se/operators/kubegres.yaml
kubectl create -f deploy/kubernetes/tmeit-se/operators/redis-operator.yaml
echo Finished installing Database software!

tilt up
