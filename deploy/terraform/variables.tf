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
