# node-app-template

This is a starting point for a node.js app or micro-service. Just clone and rename the repo and start coding.

## Running locally

### Mac and Windows Pre-requisites

Assuming you're working on a Mac or Windows machine, you'll need a Linux virtual machine to use for development. Vagrant and Virtualbox are a great, free solution (though this hasn't been tested on Windows):

- Vagrant: http://www.vagrantup.com/downloads.html
- Virtualbox: https://www.virtualbox.org/wiki/Downloads

You can also install Virtuabox on a Mac using Homebrew:

```bash
$ brew cask install virtualbox
```

Now you can start the environment:

```bash
$ git clone git@github.com:thehackerati/node-app-template.git
$ cd node-app-template
$ vagrant plugin install vagrant-docker-compose
$ vagrant up
```

You'll be prompted to login using an account with admin privileges on your host machine to enable network syncronization of the source tree on your host machine with the Vagrant VM.

Once the VM is started, check out the app:

```bash
$ open http://192.168.59.103:8080
```

### Linux Pre-requisites

On Linux, you can run Docker natively, so you don't actually need a virtual machine. To install Docker, make sure you're logged in as a user with sudo privileges. You'll need wget, and you'll need to make sure you have installed all of the pre-requisites for your version of Linux, which can be numerous (there were none for Ubuntu 64-bit 14.04.2).

- Docker: https://docs.docker.com/installation/
- Docker Compose: https://docs.docker.com/compose/install/

Start by installing Docker:

```bash
$ wget -qO- https://get.docker.com/ | sh
$ sudo usermod -aG docker <your user name>
```

Now verify that Docker is properly installed:

```bash
$ docker run hello-world
```

Then install Docker Compose:

```bash
$ sudo -i curl -L https://github.com/docker/compose/releases/download/1.3.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
$ chmod +x /usr/local/bin/docker-compose
```

At this point, you can clone the repo and start the Docker containers:

```bash
$ git clone git@github.com:thehackerati/node-app-template.git
$ cd node-app-template
$ docker-compose up
```

Once the Docker containers have started, check out the app:

```bash
$ open http://127.0.0.1:8080
```

Note that docker containers run directly on their Linux host machines, not in a virtual guest machine, so you can access any exposed ports on the loopback address: 127.0.0.1.

## What's Inside

Vagrant configures and launches a Virtualbox VM based on the Vagrantfile located in the project root and then runs docker-compose in the VM. Docker compose configures launches the Docker containers that are specified in docker-compose.yml, each according to its Dockerfile.

As a starting point, this repo only includes some very basic components:

- nginx: configured as a reverse proxy
- app: node/express scaffolding

You can extend the node/express app or you can replace it with an applicaiton framework of your choice, like Flask. You'll just need to remember to modify .travis.yml to install and run your tests on Travis.

You can also add additional services like mongodb, mysql, redis, and elasticsearch as separate containers. As a convention, add each container in its own directory under the project root and configure the container in docker-compose.yml.

## Working in the Environment

### Development Workflow

This environment is designed to support GitHub Flow, which is described in more detail here: [GitHub Flow](http://scottchacon.com/2011/08/31/github-flow.html). GitHub Flow works for Web applications that don't have traditional releases but instead aim to continuously deploy smaller changes to production as often as several times a day. Here's a summary:

- Pull from the upstream repo to make sure your local copy is in sync.
- Create a local feature branch.
- Develop the new feature and all necessary unit and functional tests. We're not dogmatic about whether you should do so in a test-first manner; use your judgement. But do write automated tests.
- On save, tests will automatically run and the application will automatically reload in the container. Repeat the code/test cycle until the test passes.
    - TODO: get grunt tests to run automatically in container
		- TODO: look for clock skew issues in container
- Frequently commit your changes.
- Push your changes to a Github feature branch of the same name at least once a day.
- Repeat until you’re ready to merge your commits (remember to frequently rebase with upstream master)
- Push to Github and open a pull request
- Review and merge the pull request to staging branch to deploy to staging environment
- Acceptance test and merge the pull request to production branch to deploy to production environment
- TODO:
    - Travis will run tests on push. Need to refine integration.
    - Deploy to AWS staging and production

### Working with Containers

To tail the log files from your containers:

```bash
$ TODO
```

To rebuild a container after changing a Dockerfile:

```bash
$ TODO
```

## Continuous Integration

You'll need to setup your own continous integration service. This repo comes with [TravisCI](http://www.travis-ci.com) already configured. Once you've pushed your code to Github, login into Travis and connect it to your repo. By default, your first build will happen the next time that you push this repo to Github.

## Staging and Production Environments

### AWS Staging Environment

TODO: Setup automated deploy to AWS Elastic Beanstalk

### AWS Production Environment

TODO: Setup automated deploy to AWS Elastic Beanstalk

## License
Copyright (c) 2015 The Hackerati. This software is licensed under the MIT License.
