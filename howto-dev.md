# Guide for setting up a development environment and pushing a new release

## Technical background

### General idea
* Webapp using a ReactJS frontend and a Python+FastAPI backend.
* Database is a standard PostgreSQL relational database
* All of our code for the app is compiled to a single OCI container (aka a Docker container)
* App runs on Kubernetes to handle load-balancing and database containers
* App compilation, container images, and deploying to kubernetes is scripted by Github Actions CI, 
and runs automatically when the master branch is updated.

### Frontend
* Frontend is compiled to static HTML, CSS, and minified JS files
* These static files are packaged into the container image to be served to users' browsers

### Backend
* Api endpoints are written with FastAPI
* FastAPI handles calls for static files too, and serves up the static files for the frontend.
* Uvicorn runs in the container and listens to incoming HTTP, and then calls FastAPI to handle the request
* Database queries and schema is managed with SQLAlchemy ORM and Alembic migrations
* Photos are uploaded to object storage

### Database
* Database runs in a container in kubernetes
* Database migrations are done with a Kubernetes Job
  * All schema changes must be designed so that old versions of the app are compatible with the new database schema.
  * An init container runs in the app Pod and makes sure that the database is fully migrated before the new app version can be start
  * https://andrewlock.net/deploying-asp-net-core-applications-to-kubernetes-part-7-running-database-migrations/
* Database backups should run every hour to back up to object storage.
  * Only the first backup of each day is kept after a month
  * Only the first backup of each month is kept after a year
* TODO: How do we make sure we can delete users for GDPR?
  * Delete their photos and remove their personal info from their profile?
  * Retroactively edit backups?

### Deployment
* Helm is used to configure different Kubernetes environments, 
making changes to the database configuration to allow for running the app in a kubernetes test environment
* Alerts
  * Grafana+loki stack for monitoring
  * Masters and devs should be emailed if an alert goes off
  * Alert criteria
    * 500 or exceptions from FastAPI
    * Database backups haven't run
    * CPU or memory are full on node
    * CrashLoop/database migration is stuck

### Tests
* All code should have automatic tests so that assumptions are verified, and regressions are caught.
* Frontend javascript code is tested inside the container when compiling the app
* Backend code is tested inside the container
* Helm charts are tested to make sure that they template correctly once the container is built, 
but before the chart is deployed to production

## Local development environment
* Local requirements: Tilt and Podman
  * Works on Linux
  * should also work on Windows and MacOS
* Live testing is done on a Kubernetes cluster by deploying with Tilt
* Container building is done with Podman on your local machine
  * I am biased against the Docker daemon and do not have it installed.
* You will need a local Kubernetes cluster to run the app for testing
  * Try microkube or ask @JustinLex for access to his home cluster
  * Could be done on the production cluster as well, but would be expensive
* Tilt does hot reloads when code is updated, compiling your containers and pushing them to the Kubernetes cluster
