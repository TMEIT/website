# SSH keys
resource "tls_private_key" "terraform_access" {  # Generate an SSH key for terraform to use to SSH into the node
  algorithm = "ED25519"
}

variable "admin_github_usernames" {  # Usernames for webb admins to install their SSH keys onto the server(s) for troubleshooting/fixing
  type    = list(string)
  default = [
    "JustinLex",  # Lex
  ]
}

# k3s release channel to install/update with
# Must be a channel listed here: https://update.k3s.io/v1-release/channels
# We let k3s update itself with point updates, (e.g v1.25.1 -> v1.25.2)
# but major updates like v1.25->v1.26 can require kubernetes migrations, so these must be done manually.
variable "k3s_channel" {
  default = "v1.25"
}

# Password for root account on node (Not used for SSH)
resource "random_string" "node_pw" {
  length           = 20
  special          = true
}

# Password hash for the root user on the server.
# Stored as a Github actions secret and passed to terraform with the environment variable TF_VAR_pw_hash
# This hash sets a password for the root user so that logging into SSH doesn't force us to "set a password".
# This password cannot be used for SSH.
variable "pw_hash" {}
