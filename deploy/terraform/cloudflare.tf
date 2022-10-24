variable "zone_id" {
  default = "6a806c0199e15cdf23bb3017a90bf149"
}
variable "domain" {
  default = "tmeit.se"
}

resource "cloudflare_zone_settings_override" "tmeit-se-settings" {
  zone_id = var.zone_id

  settings {
    always_online            = "on"
    always_use_https         = "on"
    brotli                   = "on"
    browser_check            = "on"
    development_mode         = "off"
    early_hints              = "on"
    email_obfuscation        = "on"
    hotlink_protection       = "off"
    http3                    = "on"
    ip_geolocation           = "on"
    ipv6                     = "on"
    opportunistic_onion      = "on"
    privacy_pass             = "on"
    rocket_loader            = "off"
    server_side_exclude      = "off"
    universal_ssl            = "on"
    websockets               = "on"

    cache_level              = "aggressive"  // https://developers.cloudflare.com/cache/how-to/set-caching-levels
    min_tls_version          = "1.2"
    pseudo_ipv4              = "off"
    security_level           = "essentially_off"
    tls_1_3                  = "on"
    ssl                      = "strict"

    browser_cache_ttl = 14400  // This is a minimum cache time, Cloudflare will respect longer cache times sent in headers. We should be invalidating caches with versioned filenames anyways.
    challenge_ttl = 14400
  }
}

# It's a bit of an activist choice to only use IPv6 between Cloudflare and our server. All data traffic should be IPv6!
# Github actions should tell you our IPv4 address if you need to SSH into the server.
# Github actions only supports IPv4 sadly,
# so we have to pay 5 kr/month for an IPv4 address so that github actions can SSH and use kubectl :'(

// tmeit.se
resource "cloudflare_record" "root-aaaa" {
  zone_id = var.zone_id
  name    = "@"
  type    = "AAAA"
  value   = hcloud_server.node1.ipv6_address
  proxied = true
}

// www.tmeit.se
resource "cloudflare_record" "www-aaaa" {
  zone_id = var.zone_id
  name    = "www"
  type    = "AAAA"
  value   = hcloud_server.node1.ipv6_address
  proxied = true
}

// MX
resource "cloudflare_record" "mx-1" {
  zone_id  = var.zone_id
  name     = "@"
  type     = "MX"
  value    = "mailcluster.loopia.se."
  priority = 10
}
resource "cloudflare_record" "mx-2" {
  zone_id  = var.zone_id
  name     = "@"
  type     = "MX"
  value    = "mail2.loopia.se."
  priority = 20
}

# cert-manager + Let's Encrypt token for DNS-01 validation
resource "cloudflare_api_token" "dns_validation_token" {
  name = "dns_validation_token"

  policy {
    permission_groups = [
      data.cloudflare_api_token_permission_groups.all.permissions["DNS Write"],
    ]
    resources = {
      "com.cloudflare.api.account.zone.${var.zone_id}" = "*"
    }
  }

  # Token is IP whitelisted so it can only be used from Kubernetes
  condition {
    request_ip {
      in     = [hcloud_server.node1.ipv4_address, hcloud_server.node1.ipv6_address]
    }
  }
}

data "cloudflare_api_token_permission_groups" "all" {}  # Needed for cloudflare_api_tokens https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/api_token
