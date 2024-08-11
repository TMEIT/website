default_registry('ttl.sh/tmeit-website-f8eb929a359f')
allow_k8s_contexts("kind-kind")

# Watch files for hot-reload
watch_file('deploy/kubernetes/base')
watch_file('deploy/kubernetes/dev')

# Build main app with live_update enabled
docker_build('tmeit-app', '.',
    dockerfile="containerfiles/tmeit-app-dev.Containerfile",
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
docker_build('tmeit-app-test', '.', dockerfile="containerfiles/tmeit-app-test.Containerfile")
docker_build('tmeit-worker', '.', dockerfile="containerfiles/tmeit-worker.Containerfile")
docker_build('create-test-db', '.', dockerfile="containerfiles/create-test-db.Containerfile")
k8s_yaml(kustomize('deploy/kubernetes/dev'))
k8s_resource('tmeit-app', port_forwards="8080:8080")
k8s_resource('tmeit-app-test')
k8s_resource('tmeit-worker')
k8s_resource('mailhog', port_forwards="8025:8025")
k8s_resource(new_name='tmeit-db', objects=['tmeit-db:Kubegres'], extra_pod_selectors={'app': 'tmeit-db'})
local_resource('db-port-forward', serve_cmd='kubectl port-forward svc/tmeit-db 5432:5432')
local_resource('pict-rs-port-forward', serve_cmd='kubectl port-forward deployment/pict-rs 3000:8080')
