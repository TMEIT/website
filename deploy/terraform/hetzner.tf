resource "hcloud_server" "node1" {
  name        = "node1"
  server_type = "cx11"
  image       = "debian-11"
  location = "hel1"  # Helsinki
  # user_data # used for cloud init
  # ssh_keys
  public_net {
    ipv4_enabled = true
    ipv6_enabled = true
  }
}

# first boot steps
# Add user with ssh keys and pw
# enable auto updates
# Install and enable k3s
# kubeconfig???

# if node is destroyed, database must be restored from backup:
# Download latest backup from backblaze
# Port-forward postgres service
# Get database password from kubernetes with the command
# Connect to database and restore from backup

# How to update k3s without destroying node?
# Will need to use SSH

# Debian will have to be updated manually with SSH
