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

output "cloudflare-le-token" {
  description = "Cloudflare token for Kubernetes to use for DNS-01 validation on Let's Encrypt"
  value = cloudflare_api_token.dns_validation_token.value
  sensitive = true
}


output "b2-db-backup-bucket" {
  description = "Name of the B2 DB-backup bucket"
  value = b2_bucket.db-backups.bucket_name
}

output "b2-db-key-id" {
  description = "ID for the application key for accessing the database backup bucket on Backblaze B2"
  value = b2_application_key.database-backup.application_key_id
}

output "b2-db-key-secret" {
  description = "Secret application key for accessing the database backup bucket on Backblaze B2"
  value = b2_application_key.database-backup.application_key
  sensitive = true
}