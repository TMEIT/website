# Load modules
load('ext://podman', 'podman_build')

# Load variables from tilt_options.json
settings = read_json('tilt_options.json', default={})
default_registry(settings.get("default_registry"))
allow_k8s_contexts(settings.get("allow_k8s_contexts"))

# Watch files for hot-reload
watch_file('deploy/kubernetes/base')
watch_file('deploy/kubernetes/dev')

# Build, deploy, and port-forward
podman_build('tmeit-app', '.', extra_flags=["-f", "containerfiles/tmeit-app-dev.Containerfile"])
podman_build('tmeit-app-test', '.', extra_flags=["-f", "containerfiles/tmeit-app-test.Containerfile"])
podman_build('create-test-db', '.', extra_flags=["-f", "containerfiles/create-test-db.Containerfile"])
k8s_yaml(kustomize('deploy/kubernetes/dev'))
k8s_resource('tmeit-app', port_forwards="8080:8080")
k8s_resource('tmeit-app-test')
k8s_resource(new_name='tmeit-db', objects=['tmeit-db:Kubegres:default'],
             extra_pod_selectors={'app':'tmeit-db'}, port_forwards="5432:5432")
