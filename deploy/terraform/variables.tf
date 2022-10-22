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

# k3s version to install/update to
variable "k3s_version" {
  default = "v1.25.2+k3s1"
}

# Password hash for the root user on the server.
# Stored as a Github actions secret and passed to terraform with the environment variable TF_VAR_pw_hash
# This hash lets set a password for the root user so that we can log into the server via the Hetzner console if we have a disaster and we can't SSH.
# Lex has the unhashed password.
variable "pw_hash" {}
