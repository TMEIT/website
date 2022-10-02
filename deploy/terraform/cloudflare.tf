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
    waf                      = "off"
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

// tmeit.se
resource "cloudflare_record" "root-a" {
  zone_id = var.zone_id
  name    = "@"
  type    = "A"
  value   = "93.188.2.54"
  proxied = true
}
resource "cloudflare_record" "root-aaaa" {
  zone_id = var.zone_id
  name    = "@"
  type    = "AAAA"
  value   = "2a02:250:0:8::52"
  proxied = true
}

// www.tmeit.se
resource "cloudflare_record" "www-a" {
  zone_id = var.zone_id
  name    = "www"
  type    = "A"
  value   = "93.188.2.54"
  proxied = true
}
resource "cloudflare_record" "www-aaaa" {
  zone_id = var.zone_id
  name    = "www"
  type    = "AAAA"
  value   = "2a02:250:0:8::52"
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

// Loopia CNAMEs

resource "cloudflare_record" "autoconfig" {
  zone_id = var.zone_id
  name    = "autoconfig"
  type    = "CNAME"
  value   = "autoconfig.loopia.com."
}
resource "cloudflare_record" "imap" {
  zone_id = var.zone_id
  name    = "imap"
  type    = "CNAME"
  value   = "mailcluster.loopia.se."
}
resource "cloudflare_record" "mail" {
  zone_id = var.zone_id
  name    = "mail"
  type    = "CNAME"
  value   = "mailcluster.loopia.se."
}
resource "cloudflare_record" "mail2" {
  zone_id = var.zone_id
  name    = "mail2"
  type    = "CNAME"
  value   = "mail2.loopia.se."
}
resource "cloudflare_record" "pop3" {
  zone_id = var.zone_id
  name    = "pop3"
  type    = "CNAME"
  value   = "mailcluster.loopia.se."
}
resource "cloudflare_record" "smtp" {
  zone_id = var.zone_id
  name    = "smtp"
  type    = "CNAME"
  value   = "mailcluster.loopia.se."
}
resource "cloudflare_record" "webbmail" {
  zone_id = var.zone_id
  name    = "webbmail"
  type    = "CNAME"
  value   = "webmail.loopia.se."
}
resource "cloudflare_record" "webmail" {
  zone_id = var.zone_id
  name    = "webmail"
  type    = "CNAME"
  value   = "webmail.loopia.se."
}

//Loopia SRV

resource "cloudflare_record" "_autodiscover_tcp" {
  zone_id = var.zone_id
  name    = "_autodiscover._tcp"
  type    = "SRV"
  ttl     = 3600
  data {
    service  = "_autodiscover"
    proto    = "_tcp"
    name     = "tmeit.se"
    priority = 100
    weight   = 1
    port     = 443
    target   = "autodiscover.loopia.com.tmeit.se"
  }
}