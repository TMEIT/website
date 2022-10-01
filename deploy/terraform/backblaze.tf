// Bucket used for Github Actions to store terraform state
resource "b2_bucket" "terraform-state" {
  bucket_name = "tmeit-terraform-state"
  bucket_type = "allPrivate"
  default_server_side_encryption {
    algorithm = "AES256"
    mode = "SSE-B2"
  }
}
