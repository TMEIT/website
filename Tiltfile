# Load modules
load('ext://podman', 'podman_build')

# Load variables from tilt_options.json
settings = read_json('tilt_options.json', default={})
default_registry(settings.get("default_registry"))
allow_k8s_contexts(settings.get("allow_k8s_contexts"))

# Watch files for hot-reload
watch_file('deploy/kubernetes/base')
watch_file('deploy/kubernetes/dev')

# Build main app with live_update enabled
podman_build('tmeit-app', '.',
    extra_flags=["-f", "containerfiles/tmeit-app-dev.Containerfile"],
    live_update=[
        sync('./back', '/code/'),
        sync('./front/src', '/code/front'),
        sync('./front/package-lock.json', '/code/front'),
        sync('./front/package.json', '/code/front'),
        sync('./front/webpack.config.js', '/code/front'),
        run('poetry install --only main --no-interaction --no-ansi',
            trigger=['./back/pyproject.toml', './back/poetry.lock']),
        run('npm install',
            trigger=['./front/package.json', './front/package-lock.json']),
        run('npm run-script build'),
    ]
)

# Build, deploy, and port-forward
podman_build('tmeit-app-test', '.', extra_flags=["-f", "containerfiles/tmeit-app-test.Containerfile"])
podman_build('tmeit-worker', '.', extra_flags=["-f", "containerfiles/tmeit-worker.Containerfile"])
podman_build('create-test-db', '.', extra_flags=["-f", "containerfiles/create-test-db.Containerfile"])
k8s_yaml(kustomize('deploy/kubernetes/dev'))
k8s_resource('tmeit-app', port_forwards="8080:8080")
k8s_resource('tmeit-app-test')
k8s_resource('tmeit-worker')
k8s_resource(new_name='tmeit-db', objects=['tmeit-db:Kubegres'], extra_pod_selectors={'app': 'tmeit-db'})
local_resource('db-port-forward', serve_cmd='kubectl port-forward svc/tmeit-db 5432:5432')
