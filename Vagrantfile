# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
    config.vm.box = "ubuntu/trusty64"

    config.vm.network "private_network", ip: "192.168.59.103"
    config.vm.synced_folder ".", "/src", type: "nfs"

    # Enable ssh forward agent
    config.ssh.forward_agent = true

    # need to run apt-get update
    config.vm.provision :shell, inline: "apt-get update"

    config.vm.provision :docker
    config.vm.provision :docker_compose, yml: "/src/docker-compose.yml", rebuild: true, project_name: "node-app-template", run: "always"
end
