output "droplet_ip" {
    value =  digitalocean_droplet.web.ipv4_address
}

output "database_url" {
    value = local.database_url
    sensitive = true
}