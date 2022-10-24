# Variables that we fetch from terraform during our Github actions pipeline

output "ipv4_address" {
  description = "IPv4 address connecting to our server node"
  value = hcloud_server.node1.ipv4_address
}

output "ssh_key" {
  description = "SSH key for connecting to our server node"
  value = tls_private_key.terraform_access.private_key_openssh
  sensitive = true
}