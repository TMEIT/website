locals {

  # This is a cloud-init file to configure the server on first boot.
  # See:
  # https://cloudinit.readthedocs.io/en/latest/topics/format.html
  # https://cloudinit.readthedocs.io/en/latest/topics/examples.html

  cloud_init = <<-EOT
    #cloud-config

    package_update: true
    package_upgrade: true
    packages:
      - unattended-upgrades  # Auto-update debian point releases (e.g. 11.1 -> 11.2)
      - ssh-import-id  # fix ssh key import
      - apparmor  # fix containerd on debian 11

    users:
      - name: root
        ssh_authorized_keys:  # Install Terraform's SSH key that it will use on the server
          - "${tls_private_key.terraform_access.public_key_openssh}"

    runcmd:
      # pulls and installs admins' SSH keys from github
      %{ for user in var.admin_github_usernames }
      - "ssh-import-id 'gh:${user}'"
      %{ endfor }
      # Enable auto updates for debian
      - "systemctl enable --now unattended-upgrades"
      # Install and run k3s
      - "curl -sfL https://get.k3s.io | INSTALL_K3S_CHANNEL=${var.k3s_version} sh -"

    write_files:
      # unattended-upgrades configuration found here
      # https://www.linode.com/docs/guides/how-to-configure-automated-security-updates-debian/
      - path: "/etc/apt/apt.conf.d/50unattended-upgrades"
        content: |
          "o=Debian,a=stable";
          "o=Debian,a=stable-updates";
          "o=Debian,a=proposed-updates";
          Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
          Unattended-Upgrade::Remove-New-Unused-Dependencies "true";
          Unattended-Upgrade::Remove-Unused-Dependencies "true";
      - path: "/etc/apt/apt.conf.d/20auto-upgrades"
        content: |
          APT::Periodic::Update-Package-Lists "1";
          APT::Periodic::Unattended-Upgrade "1";
          APT::Periodic::AutocleanInterval "7";
      # Configure SSH
      - path: "/etc/ssh/sshd_config.d/90_disable_pw_auth.conf"
        content: "PasswordAuthentication no"
      - path: "/etc/ssh/sshd_config.d/80_banner.conf"
        content: "Banner /etc/ssh/sshd_config.d/banner"
      - path: "/etc/ssh/sshd_config.d/banner"
        content: |-
          --------------------------------------------------------------------------------
          You are SSHing into the TMEIT website server. This should only be done in order to update Debian or to recover the server from an emergency.

          If anything bad happens to this server, MEMBER DATA COULD BE LOST!

          You may be able to make your changes using Terraform or Kubernetes by committing to the Github repo at https://github.com/TMEIT/website .

          If that doesn't work, your problem may be able to be solved with the Kubernetes API. Try using the "kubectl" command from the server's SSH console.

          Good luck!
          - Lex
          --------------------------------------------------------------------------------

    EOT
}

resource "hcloud_server" "testnode" {
  name        = "testnode"
  server_type = "cx11"
  image       = "debian-11"
  location = "hel1"  # Helsinki
  user_data = local.cloud_init # Used for cloud init, runs stuff when server is created
  # ssh_keys
  public_net {
    ipv4_enabled = true
    ipv6_enabled = true
  }
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
