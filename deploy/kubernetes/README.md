# deploy/kubernetes
This folder contains the kubernetes manifests used to run the app and related services, like databases.

The manifests in `base/` are common to both dev environments and prod.

The manifests in `dev/` and `prod/` extend the base manifests to adapt them to the specifics of each environment

The `kustomization.yaml` files decide which manifests are loaded, and how they are patched.

See [this blog](https://www.densify.com/kubernetes-tools/kustomize) for a crash course on how Kustomize works, 
and see the [documentation here](https://kubectl.docs.kubernetes.io/references/kustomize/kustomization/) for reference.