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
