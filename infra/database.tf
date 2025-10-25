resource "digitalocean_database_cluster" "pg" {
    name       = "${var.project_name}-pg"
    engine     = "pg"
    version    = "${var.pg_version}"
    size       = "${var.pg_size}"
    region     = "${var.region}"
    node_count = "${var.pg_node_count}"
}

resource "digitalocean_database_db" "pamdb" {
    cluster_id = digitalocean_database_cluster.pg.id
    name       = "${var.project_name}-db"
}

resource "digitalocean_database_user" "pamuser" {
    cluster_id = digitalocean_database_cluster.pg.id
    name       = "pamuser"
}

resource "digitalocean_database_firewall" "dbfirewall" {
    cluster_id = digitalocean_database_cluster.pg.id
    rule {
        type  = "ip_addr"
        value = digitalocean_droplet.web.ipv4_address
    }
}

locals {
    database_url = "postgres://${digitalocean_database_user.pamuser.name}:${digitalocean_database_user.pamuser.password}@${digitalocean_database_cluster.pg.host}:${digitalocean_database_cluster.pg.port}/${digitalocean_database_db.pamdb.name}?sslmode=require"

    merged_env = merge(var.compose_env, {
    # Compose DB
    DB_NAME = digitalocean_database_db.pamdb.name
    DB_USER = digitalocean_database_user.pamuser.name
    DB_PASS = digitalocean_database_user.pamuser.password
    DB_HOST = "db"
    DB_PORT = "5432"

    # Backend
    # Fails if secret key is not provided
    DJANGO_SECRET_KEY    = try(
        lookup(var.compose_env, "DJANGO_SECRET_KEY"),
        error("Missing required key: DJANGO_SECRET_KEY in compose_env")
    )
    DJANGO_ALLOWED_HOSTS = lookup(var.compose_env, "DJANGO_ALLOWED_HOSTS", "*")
    DEBUG                = lookup(var.compose_env, "DEBUG", "False")
    PORT                 = tostring(var.app_port)
    })

    env_file = join("\n", [for k, v in local.merged_env : "${k}=${v}"])
}

# Bundle ./app and upload -> build/run on droplet
data "archived_file" "app_tar" {
    type        = "tar.gz"
    source_dir  = "${path.module}/../app"
    output_path = "${path.module}/../app.tar.gz"
}

resource "null_resource" "deploy_app" {
    depends_on = [
        digitalocean_droplet.web,
        digitalocean_database_firewall.dbfirewall
    ]

    triggers = { app_md5 = data.archived_file.app_tar.output_md5 }

    connection {
        type        = "ssh"
        host        = digitalocean_droplet.web.ipv4_address
        user        = "root"
        private_key = var.ssh_private_key
    }

    provisioner "file" {
        source = data.archived_file.app_tar.output_path
        destination = "/opt/app/app.tar.gz"
    }

    provisioner "file" {
        content = local.env_file
        destination = "/opt/app/.env"
    }

    provisioner "remote-exec" {
        inline = [
            "cd  /opt/app",
            "tar -xzf app.tar.gz --strip-components=1",
            "docker compose pull || true",
            "docker compose build",
            "docker compose up -d",
            "docker system prune -f"
        ]
    }
}