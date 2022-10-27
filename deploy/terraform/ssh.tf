
# SSH script that runs on every deploy
resource "null_resource" "run-ssh-install" {

  triggers = { always_run = timestamp() } # run this provisioner every time

  connection {
    type = "ssh"
    user = "root"
    private_key = tls_private_key.terraform_access.private_key_openssh
    host = hcloud_server.node1.ipv4_address
  }
  provisioner "remote-exec" {
    inline = flatten([
      # flatten unpacks any lists that are embedded

      # Update system
      "apt update -q",
      "apt upgrade -qy",

      # Install unattended-upgrades (for auto-updating packages), ssh-import-id (to make SSH key management simpler),
      # and apparmor (to fix containerd on debian 11)
      "apt install -qy unattended-upgrades ssh-import-id apparmor",

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
      "mkdir -p /etc/rancher/k3s",
      format("echo '%s' > /etc/rancher/k3s/config.yaml", yamlencode({
        node-ip = join(",", [
          hcloud_server.node1.ipv4_address,
          hcloud_server.node1.ipv6_address]),
        kubelet-arg = "'--node-ip=::'",

        # The IPv6 subnets used are "Unique Local Address" subnets. K3s limits us to /108 IPv6 subnets :/
        cluster-cidr = "10.42.0.0/16,fd58:266e:9853:0042::/112"
        service-cidr = "10.43.0.0/16,fd58:266e:9853:0043::/112"
      })),

      # Install/Update k3s
      "curl -sfL https://get.k3s.io | INSTALL_K3S_CHANNEL='${var.k3s_release_channel}' sh -",
    ])
  }
}

locals {
  # List of ssh-import-id commands that imports all of the admins' SSH keys, keys are copied from their Github profile
  import_admin_keys = [for u in var.admins_github_names : "ssh-import-id gh:${u}"]
}
