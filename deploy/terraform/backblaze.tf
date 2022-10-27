// Bucket used for Github Actions to store terraform state
resource "b2_bucket" "terraform-state" {
  bucket_name = "tmeit-terraform-state"
  bucket_type = "allPrivate"
  default_server_side_encryption {
    algorithm = "AES256"
    mode = "SSE-B2"
  }
}

// Bucket used for database backups
resource "b2_bucket" "db-backups" {
  bucket_name = "tmeit-db-backups"
  bucket_type = "allPrivate"

  default_server_side_encryption {
    algorithm = "AES256"
    mode = "SSE-B2"
  }

  # Lifecycle rules used to prune old backups
  lifecycle_rules {
    file_name_prefix = "tmeit-db-backup-hourly"
    days_from_hiding_to_deleting  = 14
  }
  lifecycle_rules {
    file_name_prefix = "tmeit-db-backup-daily"
    days_from_hiding_to_deleting  = 365
  }
  # (Monthly backups are kept forever)

  # Protects backups from being deleted by a ransomware attacker; Backups cannot be deleted before 2 weeks.
  file_lock_configuration {
    is_file_lock_enabled = true
    default_retention {
      mode = "compliance"
      period {
        duration = 14
        unit     = "days"
      }
    }
  }
}

# Backblaze key for database backups
resource "b2_application_key" "database-backup" {
  key_name     = "database-backup"
  capabilities = ["listBuckets", "listFiles", "readFiles", "writeFiles"]
  bucket_id = b2_bucket.db-backups.id
}

// Bucket holding the backups for the old tmeit.se from 2011
resource "b2_bucket" "tmeit-se-2011-dump" {
  bucket_name = "tmeit-se-2011-dump"
  bucket_type = "allPrivate"
}
