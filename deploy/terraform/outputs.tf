# Variables that we fetch from terraform during our Github actions pipeline

output "ipv4_address" {
  description = "IPv4 address connecting to our server node"
  value = hcloud_server.testnode.ipv4_address
}

output "k3s_channel" {
  description = "k3s release channel to update with"
  value = var.k3s_channel
}

output "ssh_key" {
  description = "SSH key for connecting to our server node"
  value = tls_private_key.terraform_access.private_key_pem
  sensitive = true
}