terraform {
  required_version = ">= 1.0.0"
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
      version = "~> 3.0"
    }
    b2 = {
      source = "Backblaze/b2"
    }
  }
}

provider "cloudflare" {
  // Token is pulled from $CLOUDFLARE_API_TOKEN environment variable
}

provider "b2" {
  // Application key is pulled from $B2_APPLICATION_KEY_ID and $B2_APPLICATION_KEY environment variables
}
