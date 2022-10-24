# Kubernetes Operators

This directory contains the Kubernetes operators that we use to add functionality to Kubernetes and automate tasks.

Operators are containers that read and write to the Kubernetes API to make managing the server easier.
You can read more about Kubernetes Operators [here](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/).

Note that the operators are distributed as YAML files that install everything on the cluster. 
The YAML files in this directory have been copied from the operator website, they should not be edited manually.

## Operators we use

### SealedSecrets
This operator lets us store secrets safely in git. 
By keeping the secrets in git, we don't have to worry if they've been changed on the server or not.
The secrets are encrypted with a key that only the Kubernetes server has, keeping them safe from prying eyes.

https://github.com/bitnami-labs/sealed-secrets

Latest YAML file:  
https://github.com/bitnami-labs/sealed-secrets/releases/latest/download/controller.yaml

### cert-manager
This operator lets Kubernetes automatically create and renew certs with Let's Encrypt. 
The certs are stored in the Kubernetes API, and everything is logged there as well. 

https://cert-manager.io/

Latest YAML file:  
https://github.com/cert-manager/cert-manager/releases/latest/download/cert-manager.yaml

### kubegres
This operator automatically creates and manages PostgreSQL clusters on Kubernetes.
It handles automatic database creation, replication, failover, and backups.
It really simplifies the process of creating a database, and makes it really safe with multiple layers to recover from.

https://www.kubegres.io/

Latest YAML file:  
https://raw.githubusercontent.com/reactive-tech/kubegres/[VERSION]/kubegres.yaml
