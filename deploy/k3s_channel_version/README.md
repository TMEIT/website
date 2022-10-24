# k3s Channel

The file `channel` contains the current k3s release channel we are using/autoupdating with.

k3s is the distribution of Kubernetes we are using. We update k3s because Kubernetes can receive security and bug fixes, 
and new point releases of kubernetes (e.g. v1.25->v1.26) can add new features to the Kubernetes API.

The channel must be a channel listed [here](https://update.k3s.io/v1-release/channels).

We let k3s update itself with point updates, (e.g v1.25.1 -> v1.25.2), 
but major updates like v1.25->v1.26 can require kubernetes migrations, so these must be done manually.

## Update often
Major Kubernetes versions have a [lifespan of about 1 year](https://kubernetes.io/releases/patch-releases), so Kubernetes must be updated at least yearly.

## Changing the channel
**IT IS IMPORTANT TO CHECK KUBERNETES API CHANGES IN THE KUBERNETES CHANGELOG WHEN DOING A MAJOR UPDATE OF KUBERNETES!**

When the channel is changed, the Github Actions workflow `publish-master.yaml` will automatically update the k3s server over SSH.

Make sure you don't add a newline to the `channel` file, or scripts will break.
