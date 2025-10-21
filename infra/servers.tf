resource "digitalocean_droplet" "web" {
    name = var.project_name
    region = var.region
    size = var.droplet_size
    image = var.droplet_image
    
}