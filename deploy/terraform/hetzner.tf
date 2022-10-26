
# IF NODE IS ACCIDENTALLY REGENERATED:
# * SSH will be broken initially, you must go to the node in the Hetzner Cloud console and hit Rescue > Reset Root Password
# * The database will be gone, you must restore the database from the backup:
#   1. Download latest backup from backblaze
#   2. Use Kubernetes to port-forward postgres service to your local machine
#   3. Get database password from kubernetes with the command
#   4. Connect to database with psql and restore from backup

resource "hcloud_server" "node1" {
  name        = "node1"
  server_type = "cx11"
  image       = "debian-11" # Note that you shouldn't upgrade Debian from here, you should use "apt full-upgrade" from SSH
  location = "hel1"  # Helsinki
  user_data = local.cloud_init # Configures cloud-init to install an SSH key for us
  public_net {
    ipv4_enabled = true
    ipv6_enabled = true
  }
  firewall_ids = [hcloud_firewall.myfirewall.id]

  # Prevent Terraform from deleting the server by accident
  delete_protection = false
  rebuild_protection = false

  # SSH into server to configure it
  connection {
    type     = "ssh"
    user     = "root"
    private_key = tls_private_key.terraform_access.private_key_openssh
    host     = self.ipv4_address
  }
  provisioner "remote-exec" {
    inline = flatten([ # flatten unpacks any lists that are embedded

      # Update system
      "apt update",
      "apt upgrade",

      # Install unattended-upgrades (for auto-updating packages), ssh-import-id (to make SSH key management simpler),
      # and apparmor (to fix containerd on debian 11)
      "apt install -y unattended-upgrades ssh-import-id apparmor",

      # list of ssh-import-id commands that imports all of the admins' SSH keys, as found on Github
      local.import_admin_keys,

      # Configure SSH server
      "echo '${var.ssh_password_config}' > /etc/ssh/sshd_config.d/90_disable_pw_auth.conf",
      "echo '${var.banner_config}' > /etc/ssh/sshd_config.d/80_banner.conf",
      "echo '${var.server_banner}' > /etc/ssh/sshd_config.d/banner",

      # enable unattended upgrade
      # unattended-upgrades configuration found here
      # https://www.linode.com/docs/guides/how-to-configure-automated-security-updates-debian/
      "echo '${var.apt-unattended-upgrades}' > /etc/apt/apt.conf.d/50unattended-upgrades",
      "echo '${var.apt-auto-upgrades}' > /etc/apt/apt.conf.d/20auto-upgrades",
      "systemctl enable --now unattended-upgrades",

      # Configure k3s to enable IPv6
      # https://docs.k3s.io/installation/configuration#configuration-file
      # https://docs.k3s.io/installation/network-options#dual-stack-installation
      format("echo '%s' > /etc/rancher/k3s/config.yaml", yamlencode({
        node-ip = join(",", [self.ipv4_address, self.ipv6_address]),
        kubelet-arg = "--node-ip=::",

        # The IPv6 subnets used are "Unique Local Address" subnets (and have 2^48 more addresses than the IPv4 subnets)
        cluster-cidr = "10.42.0.0/16,fd58:266e:9853:0042::/64"
        service-cidr = "10.43.0.0/16,fd58:266e:9853:0043::/64"
      })),

      # Install/Update k3s
      "curl -sfL https://get.k3s.io | INSTALL_K3S_CHANNEL='${var.k3s_release_channel}' sh -",
    ])
  }
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
    # List of ssh-import-id commands that imports all of the admins' SSH keys, as found on Github
  import_admin_keys = [for u in var.admins_github_names : "ssh-import-id ${u}"]

  # This is a cloud-init file to install an SSH key on first boot.
  # NOTE THAT REGENERATING THE SSH KEY REGENERATES THE SERVER!
  # Regenerating the server deletes the active database and requires a manual database recovery from backup.
  # Also, it takes a few minutes for the server to recreate, and the first github action pipeline after a server recreation will fail.
  # You must rerun the Github Actions pipline after a few minutes after recreating the server.
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
