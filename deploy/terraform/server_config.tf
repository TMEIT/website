# SSH key that terraform will use to SSH into nodes
resource "tls_private_key" "terraform_access" {
  algorithm = "ED25519"
}

# Github users that are allowed to SSH into the server
variable "admins_github_names" {
  type    = list(string)
  default = ["JustinLex"]
}

# Config file that disables SSH password authentication
variable "ssh_password_config" {
  default = "PasswordAuthentication no"
}

# Files used to configure the SSH banner
variable "banner_config" {
  default = "Banner /etc/ssh/sshd_config.d/banner"
}
variable "server_banner" {
  default = <<-EOT
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

# Files used to configure Debian unattended-upgrades
variable "apt-unattended-upgrades" {
  default = <<-EOT
    "o=Debian,a=stable";
    "o=Debian,a=stable-updates";
    "o=Debian,a=proposed-updates";
    Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
    Unattended-Upgrade::Remove-New-Unused-Dependencies "true";
    Unattended-Upgrade::Remove-Unused-Dependencies "true";
    EOT
}
variable "apt-auto-upgrades" {
  default = <<-EOT
    APT::Periodic::Update-Package-Lists "1";
    APT::Periodic::Unattended-Upgrade "1";
    APT::Periodic::AutocleanInterval "7";
    EOT
}
