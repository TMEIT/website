# K3s release channel

# K3s is the distribution of Kubernetes we are using.
# Minor updates (e.g. v1.25.1 -> v1.25.2) offer security fixes and bug fixes.
# Major updates (e.g. v1.25->v1.26) add new features to Kubernetes but also contain breaking changes.

# Using Release channels allow k3s to update to the latest point version everytime we run terraform
# But they also pin us to a specific point version, so we don't accidentally upgrade without being ready for it.
# Available k3s channels can be found at https://update.k3s.io/v1-release/channels

# Major Kubernetes versions have a lifespan of about 1 year, so Kubernetes must be updated to the next major release at least yearly.
# Always read the kubernetes changelog before upgrading between major releases.

variable "k3s_release_channel" {
  default = "v1.25"
}
