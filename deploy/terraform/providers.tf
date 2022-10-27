terraform {
  required_version = ">= 1.0.0"

  // Store Terraform state in Backblaze
  backend "s3" {
    // Reddit thread about using Backblaze B2 as Terraform state
    // https://www.reddit.com/r/backblaze/comments/v0uiwe/can_backblaze_b2_be_used_as_a_terraform_backend/

    bucket = "tmeit-terraform-state"
    key    = "terraform.tfstate"
    region = "eu-central"
    endpoint = "s3.eu-central-003.backblazeb2.com"

    // Options needed to use Backblaze B2
    skip_credentials_validation = true
    skip_region_validation = true
    skip_metadata_api_check = true

    // Credentials to reach the backend state bucket are pulled from $AWS_ACCESS_KEY_ID and $AWS_SECRET_ACCESS_KEY environment variables
  }

  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
      version = "~> 3.0"
    }
    b2 = {
      source = "Backblaze/b2"
    }
    hcloud = {
      source = "hetznercloud/hcloud"
      version = "1.35.2"
    }
  }
}

provider "cloudflare" {
  // Token is pulled from $CLOUDFLARE_API_TOKEN environment variable
}

provider "b2" {
  // Application key is pulled from $B2_APPLICATION_KEY_ID and $B2_APPLICATION_KEY environment variables
}

provider "hcloud" {
  // Token is pulled from HCLOUD_TOKEN environment variable
}
