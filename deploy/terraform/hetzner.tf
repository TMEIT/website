locals {

  # This is a cloud-init file to configure the server on first boot.
  # See:
  # https://cloudinit.readthedocs.io/en/latest/topics/format.html
  # https://cloudinit.readthedocs.io/en/latest/topics/examples.html

  # IMPORTANT
  # DO NOT CHANGE THE CLOUD INIT FILE
  # It will delete and recreate the server, which will require manual database recovery.
  # Also, it takes a few minutes for the server to recreate,
  # and the first github action pipeline after a server recreation will fail.
  # You must rerun the Github Actions pipline after a few minutes after recreating the server.

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
        passwd: '${var.pw_hash}' # Set a password for root So that SSH doesnt lock up. This password can only be used on the Hetzner console, not SSH.
        ssh_authorized_keys:  # Install Terraform's SSH key that it will use on the server
          - "${tls_private_key.terraform_access.public_key_openssh}"

    runcmd:
      # pulls and installs Lex's SSH keys from github.
      # If other admins want to have their SSH keys added, just run "ssh-import-id gh:JustinLex" from the SSH terminal.
      - "ssh-import-id gh:JustinLex"
      # Enable auto updates for debian
      - "systemctl enable --now unattended-upgrades"
      # Install and run k3s
      - "curl -sfL https://get.k3s.io | INSTALL_K3S_CHANNEL=v1.25 sh -"

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
        content: |
          --------------------------------------------------------------------------------
          You are SSHing into the TMEIT website server. This should only be done in order to update Debian or to recover the server from an emergency.

          If anything bad happens to this server, MEMBER DATA COULD BE LOST!

          You may be able to make your changes instead using Terraform or Kubernetes by committing to the Github repo at https://github.com/TMEIT/website .

          If that doesn't work, your problem is probably solvable with the Kubernetes API. Try using the "kubectl" command from the server's SSH console.

          Note that someone who already has access to the SSH console must add your SSH keys with the command "ssh-import-id gh:USERNAME" before you can log in.

          Good luck!
          - Lex
          --------------------------------------------------------------------------------
    EOT
}

resource "hcloud_server" "node1" {
  name        = "node1"
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

# Have Hetzner set up Reverse DNS records for the server so that its less likely that emails coming from it are marked as spam
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

# SSH keys
resource "tls_private_key" "terraform_access" {  # Generate an SSH key for terraform to use to SSH into the node
  algorithm = "ED25519"
}

# Password hash for the root user on the server.
# Stored as a Github actions secret and passed to terraform with the environment variable TF_VAR_pw_hash
# This hash sets a password for the root user so that logging into SSH doesn't force us to "set a password".
# This password cannot be used for SSH.
variable "pw_hash" {}

# if node is destroyed, database must be restored from backup, restore steps:
# Download latest backup from backblaze
# Port-forward postgres service
# Get database password from kubernetes with the command
# Connect to database and restore from backup

# Debian will have to be updated manually with SSH
