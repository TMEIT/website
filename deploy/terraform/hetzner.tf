
# IF NODE IS ACCIDENTALLY REGENERATED:
# * SSH will be broken initially and parts of the pipeline will fail, you must go to the node in the Hetzner Cloud console and hit Rescue > Reset Root Password
# * The Kubernetes operators will be missing, which will make kubernetes deploys fail until they have been reinstalled.
# * The database will be gone, you must restore the database from the backup:
#   1. Download latest backup from backblaze
#   2. Use Kubernetes to port-forward postgres service to your local machine
#   3. Get database password from kubernetes with the command
#   4. Connect to database with psql and restore from backup

resource "hcloud_server" "node1" {
  name        = "node1"
  server_type = "cx31"
  keep_disk   = true
  image       = "debian-11" # Note that you shouldn't upgrade Debian from here, you should use "apt full-upgrade" from SSH
  location = "hel1"  # Helsinki
  user_data = local.cloud_init # Configures cloud-init to install an SSH key for us
  public_net {
    ipv4_enabled = true
    ipv6_enabled = true
  }

  # Prevent Terraform from deleting the server by accident
  # (You must disable node protection from the Hetzner cloud console to let Terraform delete the node)
  delete_protection = true
  rebuild_protection = true

  firewall_ids = [hcloud_firewall.myfirewall.id]
}

resource "hcloud_firewall" "myfirewall" {
  name = "my-firewall"

  rule {  # ping
    direction = "in"
    protocol  = "icmp"
    source_ips = [
      "0.0.0.0/0",
      "::/0"
    ]
  }

  rule {  # SSH
    direction = "in"
    protocol  = "tcp"
    port      = "22"
    source_ips = [
      "0.0.0.0/0",
      "::/0"
    ]
  }

  rule {  # HTTPS
    direction = "in"
    protocol  = "tcp"
    port      = "443"
    source_ips = [
      "0.0.0.0/0",
      "::/0"
    ]
  }

  rule {  # Kubernetes API / kubectl
    direction = "in"
    protocol  = "tcp"
    port      = "6443"
    source_ips = [
      "0.0.0.0/0",
      "::/0"
    ]
  }
}

# Have Hetzner set up Reverse DNS records for the server so that it's less likely that emails coming from it are marked as spam
resource "hcloud_rdns" "node1_ipv4" {
  server_id = hcloud_server.node1.id
  ip_address = hcloud_server.node1.ipv4_address
  dns_ptr = "tmeit.se"
}
resource "hcloud_rdns" "node1_ipv6" {
  server_id  = hcloud_server.node1.id
  ip_address = hcloud_server.node1.ipv6_address
  dns_ptr    = "tmeit.se"
}

locals {
  # This is a cloud-init file to install an SSH key on first boot.
  # NOTE THAT CHANGING THIS OR REGENERATING THE SSH KEY REGENERATES THE SERVER!
  # cloud-init documentation:
  # https://cloudinit.readthedocs.io/en/latest/topics/format.html
  # https://cloudinit.readthedocs.io/en/latest/topics/examples.html
  cloud_init = join("", [
    "#cloud-config\n",
    yamlencode({
        # Install Terraform's SSH key onto the server
        users = [
            {
                name = "root"
                ssh_authorized_keys = [tls_private_key.terraform_access.public_key_openssh]
            }
        ]
    })
  ])
}
