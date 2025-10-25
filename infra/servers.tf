resource "digitalocean_ssh_key" "main" {
  name       = "${var.project_name}-ssh"
  public_key = var.ssh_public_key
}

resource "digitalocean_droplet" "web" {
  name     = var.project_name
  region   = var.region
  size     = var.droplet_size
  image    = var.droplet_image
  ssh_keys = [digitalocean_ssh_key.main.fingerprint]

  user_data = <<-CLOUD
    #cloud-config
    package_update: true
    runcmd:
      - curl -fsSL https://get.docker.com | sh
      - apt-get update -y && apt-get install -y docker-compose-plugin netcat-openbsd curl
      - mkdir -p /opt/app
  CLOUD

}

resource "digitalocean_firewall" "web" {
  name        = "${var.project_name}-fw"
  droplet_ids = [digitalocean_droplet.web.id]

  # SSH
  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = var.ssh_allowed_cidrs
  }

  # HTTP only
  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # Egress allow all tcp and udp ports
  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}