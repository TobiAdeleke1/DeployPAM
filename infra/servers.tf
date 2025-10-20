resources "digitalocean_droplet" "web" {
    name = var.project_name
    region = var.region
    
}