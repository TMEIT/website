# Guide for setting up a development environment and pushing a new release

## Technical background

### General idea

- Webapp using a ReactJS frontend and a Python+FastAPI backend.
- Database is a standard PostgreSQL relational database
- All of our code for the app is compiled to a single OCI container (aka a Docker container)
- App runs on Kubernetes to for self-healing and container orchestration
- App compilation, container image building, and deploying to kubernetes is scripted by Github Actions CI,
  and runs automatically when the master branch is updated.

### Frontend

- Frontend is compiled to static HTML, CSS, and minified JS files
- These static files are packaged into the container image to be served to users' browsers
- Api documentation is accessed by the endpoint /api/v1/docs i.e. when running the site localy on localhost:8080/api/v1/docs

### Backend

- Api endpoints are written with FastAPI
- FastAPI handles calls for static files too, and serves up the static files for the frontend.
- Uvicorn runs in the container and listens to incoming HTTP, and then calls FastAPI to handle the request
- Database queries and schema is managed with SQLAlchemy ORM and Alembic migrations
- Photos are uploaded to object storage

### Database

- Database runs in a container in kubernetes
- Database migrations are done with a Kubernetes Job
  - All schema changes must be designed so that old versions of the app are compatible with the new database schema.
  - An init container runs in the app Pod and makes sure that the database is fully migrated before the new app version can be start
  - https://andrewlock.net/deploying-asp-net-core-applications-to-kubernetes-part-7-running-database-migrations/
- Database backups should run every hour to back up to object storage.
  - Only the first backup of each day is kept after a month
  - Only the first backup of each month is kept after a year
- TODO: We need to specify our backup retention policy in our GDPR policy

### Deployment

- Kustomize is used to configure different Kubernetes environments,
  making changes to the database configuration to allow for running the app in a kubernetes test environment
- Alerts
  - Grafana+loki stack for monitoring
  - Masters and devs should be emailed if an alert goes off
  - Alert criteria
    - 500 or exceptions from FastAPI
    - Database backups haven't run
    - CPU or memory are full on node
    - CrashLoop/database migration is stuck
  - External uptime checker should check external accessibility and alert system health
    - Check backend health endpoint
    - Special microservice that has an endpoint that checks that the monitoring is healthy

### Tests

- All code should have automatic tests so that assumptions are verified, and regressions are caught.
- Frontend javascript code is tested inside the container when compiling the app
- Backend code is tested inside the container
- Kubernetes manifests are tested to make sure that are valid once the container is built,
  but before the chart is deployed to production

## Local development environment

The development environment is designed to be identical to the production environment. 

The app runs in a Docker container that is similar to the production container,
and the database and helper services also run in containers alongside the main app.

As with the production environment, these containers are managed with Kubernetes (k8s). 
While the production k8s cluster runs on a Hetzner Cloud instance, 
the development k8s cluster runs on your own computer using Kind.
Both environments use similar Kubernetes YAML files to define the containers.

For rapid rebuilding and hot reloading, we use Tilt, 
which automatically rebuilds the development environment when the code changes.
Tilt is owned by Docker, inc. and is very useful for doing development in containers.

In order for Tilt to upload Docker images to the Kind Kubernetes (k8s) cluster, we use ctlptl to set up a local image registry on k8s.

### Installing
1. Install Docker, Tilt, Kubectl, and Kind.
   1. [Docker install instructions](https://www.docker.com/)
   2. [Tilt install instructions](https://docs.tilt.dev/)
   3. [Kubectl install instructions](https://kubernetes.io/docs/tasks/tools/)
   4. [Kind install instructions](https://kind.sigs.k8s.io/docs/user/quick-start)
2. Start your Kubernetes cluster
   1. Run `kind create-cluster --wait 5m` to create your Kubernetes cluster. It should take a minute or two to download everything and start the cluster.
   2. Verify that your cluster is working by running `kubectl version`. You can also run `kubectl get pods -A` to see all containers running in Kubernetes. (Note that all of Kubernetes and its running containers are all running in a Docker container named kindest/node)
3. Start your development environment
   1. cd into the root directory for this git repo (e.g. `cd ~/IdeaProjects/tmeit-website`)
   2. Run `./startdev.sh`. This will build all the containers and start up the tmeit website in your k8s cluster. (Potential issue: If you are running Fedora Linux, Docker buildkit doesn't play nice with SELinux. We could use Podman, but I think it's just easier if we disable SELinux temporarily. Run `sudo setenforce 0` to temporarily disable the SELinux security system.)
   3. Click the link that tilt gives you to see the website containers starting
   4. (Optional) Disable any containers you don't need for your testing, such as the mailserver, the worker, or redis, in order to speed up redployments.
   5. (Optional) If you get errors like `failed to create fsnotify watcher: too many open files` on Linux, increase your file limits with `ulimit -n 8192`, `sudo sysctl -w fs.inotify.max_user_instances=1024`, and `sudo sysctl -w fs.inotify.max_user_watches=12288`. Note that these new limits are reset when your computer is restarted.
   6. Once the containers have started, open your development website at localhost:8080
4. Tear down your development environment
   1. (Optional) Stop the development containers with `tilt down`
   2. Delete your Kubernetes cluster with `kind delete cluster` (Kubernetes will run in the background otherwise, eating your CPU and RAM)

## Creating a new release

- Everything in master is automatically pushed to prod
- Make your changes in a new branch
- Make sure you increment the release version number in your branch by running `python release_utils/set_new_version.py X.Y.Z`
  - Set the version number at the end of the command where `x.y.z` is
  - This project uses [semantic versioning](https://semver.org/)
- Make a PR on Github to merge your changes into master
- Your PR will be automatically tested, and only accepted if all linting and testing passes.
- New release is published and pushed to production once your PR is merged into master.
  - Container is built and published to Github's container repository
  - Kubernetes manifests with updated container tag are pushed to production cluster
  - Code archive, container, and kubernetes manifests will be published as a new release on Github for archival
