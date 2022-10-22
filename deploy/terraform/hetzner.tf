locals {

  # This is a cloud-init file to configure the server on first boot.
  # See:
  # https://cloudinit.readthedocs.io/en/latest/topics/format.html
  # https://cloudinit.readthedocs.io/en/latest/topics/examples.html

  cloud_init = <<-EOT
    #cloud-config

    package_update: true
    package_upgrade: true

    users:
      - name: root
        ssh_authorized_keys:  # Install Terraform's SSH key that it will use on the server
          - ${tls_private_key.terraform_access.public_key_openssh}
        ssh_import_id:  # pulls admins' SSH keys from github
          %{ for user in var.admin_github_usernames }
          - gh:${user}
          %{ endfor }
        passwd: ${var.pw_hash}  # Set a password for root to use with the Hetzner console in emergencies. Lex has the pw.
    runcmd:  # Enable auto updates for debian and install k3s
      - apt install unattended-upgrades
      - systemctl enable --now unattended-upgrades
      - curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=${var.k3s_version} sh -
    write_files:
      # unattended-upgrades configuration found here
      # https://www.linode.com/docs/guides/how-to-configure-automated-security-updates-debian/
      - path: /etc/apt/apt.conf.d/50unattended-upgrades
        content: |
          "o=Debian,a=stable";
          "o=Debian,a=stable-updates";
          "o=Debian,a=proposed-updates";
          Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
          Unattended-Upgrade::Remove-New-Unused-Dependencies "true";
          Unattended-Upgrade::Remove-Unused-Dependencies "true";
      - path: /etc/apt/apt.conf.d/20auto-upgrades
        content: |
          APT::Periodic::Update-Package-Lists "1";
          APT::Periodic::Unattended-Upgrade "1";
          APT::Periodic::AutocleanInterval "7";
    EOT
}

resource "hcloud_server" "test_node" {
  name        = "test_node"
  server_type = "cx11"
  image       = "debian-11"
  location = "hel1"  # Helsinki
  user_data = local.cloud_init # Used for cloud init, runs stuff when server is created
  # ssh_keys
  public_net {
    ipv4_enabled = true
    ipv6_enabled = true
    ipv6 = hcloud_primary_ip.node1_ipv6.id
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
