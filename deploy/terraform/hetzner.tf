resource "hcloud_server" "node1" {
  name        = "node1"
  server_type = "cx11"
  image       = "debian-11"
  location = "hel1"  # Helsinki
  # user_data # used for cloud init
  # ssh_keys
  public_net {
    ipv4_enabled = true
    ipv6_enabled = true
  }
}
