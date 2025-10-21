variable do_token {}
variable project_name { type = string }

variable ssh_public_key { type = string }
variable ssh_private_key {
    type = string
    sensitive = true
    
    }

variable region {
    type = string
    default = "lon1"
}

variable droplet_size {
    type = string 
    default = "s-1vcpu-512mb-10gb"
}

variable droplet_image {
    type = string
    default = "ubuntu-25-04-x64"
}