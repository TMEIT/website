# deploy/

This folder contains the deployment configurations for the website. 
Almost everything related to running the website is configured using "Infrastructure as code", 
in order to make the configuration more reliable, trackable, and easier to understand in the future.

## How the configuration works
The app runs using Kubernetes for both production and development environments. The production server is configured with Terraform.

## Subfolders
The `kubernetes/` folder contains the Kubernetes manifests for the application service and related services, like databases.

The `terraform/` folder contains the Terraform configuration to bootstrap the production server on Hetzner Cloud, 
and related services like S3-based storage on Backblaze B2, and DNS and proxy configuration on Cloudflare. 