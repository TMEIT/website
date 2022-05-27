# Load modules
load('ext://podman', 'podman_build')

# Load variables from tilt_options.json
settings = read_json('tilt_options.json', default={})
default_registry(settings.get("default_registry"))
allow_k8s_contexts(settings.get("allow_k8s_contexts"))

# Watch files for hot-reload
watch_file('deploy/base')
watch_file('deploy/dev')

# Build, deploy, and port-forward
podman_build('tmeit-app', '.', extra_flags=["-f", "containerfiles/tmeit-app-dev.Containerfile"])
k8s_yaml(kustomize('deploy/dev'))
k8s_resource('tmeit-app', port_forwards="8080:8080")
