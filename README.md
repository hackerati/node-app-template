# node-app-template

[![Build Status](https://travis-ci.org/thehackerati/node-app-template.svg?branch=master)](https://travis-ci.org/thehackerati/node-app-template)

This is a starting point for a Docker-based node.js app or micro-service, configured for continuous integration with Travis and continuous deployment to AWS. Just clone and rename the repo and start coding.

## Running locally

### Mac Pre-requisites

If you're working on a Mac, you'll need a Linux virtual machine to use for development. Vagrant and Virtualbox are a great, free solution:

- Vagrant: http://www.vagrantup.com/downloads.html
- Virtualbox: https://www.virtualbox.org/wiki/Downloads

You can also install Virtuabox on a Mac using Homebrew:

```bash
$ brew cask install virtualbox
$ brew cask install vagrant
```

Now you can start the environment:

```bash
$ git clone git@github.com:thehackerati/node-app-template.git
$ cd node-app-template
$ vagrant plugin install vagrant-docker-compose
$ vagrant up
```

You'll be prompted to login using an account with admin privileges on your host machine to enable network synchronization of the source tree on your host machine with the Vagrant VM.

Once the VM is started, check out the app:

```bash
$ open http://192.168.59.103
```

If you are getting an error, give it a minute but you may need to run

```bash
$ vagrant ssh
```
Then try refreshing or opening the page again.

### Windows Pre-requisites

Like the Mac, Windows requires you to run Linux in a virtual machine, and Vagrant/Virtualbox are a great choice!

TODO:
- Other pre-requisites?
- Install vagrant and virtualbox on Windows
- Clone the repo and vagrant up
- Test

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
$ docker-compose build
$ docker-compose up
```

You might see the following error message when attempting to start the containers:

```bash
Cannot start container <container>: Error starting userland proxy: listen tcp 0.0.0.0:80: bind: address already in use
```

If that is the case, kill all processes using that adress and try starting the containers again:

```bash
$ sudo fuser -k 80/tcp
$ docker-compose up
```

You might additionally see the following error message:

```bash
Conflict. The name "nodeapptemplate_nginx_1" is already in use by container <container>. You have to delete (or rename) that container to be able to reuse that name.
```

If that is the case, stop and remove all containers and restart:

```bash
$ docker-compose stop
$ docker-compose rm
$ docker-compose up
```

Once the Docker containers have started, check out the app:

```bash
$ open http://127.0.0.1:8080 #on mac
$ curl http://127.0.0.1:80 #on linux
```

If you use a firefox to check out the app, make sure you have 'use system proxy settings' checked off in Connection Settings, which can be found under the Network Tab in Advanced Preferences

 
Note that docker containers run directly on their Linux host machines, not in a virtual guest machine, so you can access any exposed ports on the loopback address: 127.0.0.1.

## What's Inside

Vagrant configures and launches a Virtualbox VM based on the Vagrantfile located in the project root and then runs docker-compose in the VM. Docker compose configures launches the Docker containers that are specified in docker-compose.yml, each according to its Dockerfile.

As a starting point, this repo only includes some very basic components:

- LICENSE: It's MIT licensed!
- README.md: this file
- Vagrantfile: configures a VM that runs docker-compose on boot
- app: Docker container based on the official node image, along with the node/express app scaffolding
- docker-compose.yml: runs the configured Docker containers
- nginx: Docker container for the official nginx image, configured as a reverse proxy for the app

You can add additional services like mongodb, mysql, redis, and elasticsearch as separate containers. As a convention, add each container in its own directory under the project root and configure the container in docker-compose.yml.

Note: Docker uses volumes to mount host directories in containers; so you can keep directories on your host and your container in sync. This allows you to do things like develop in your host using your favorite editor while you watch for changes to code in your container so you can automatically reload your application and/or run tests. Docker containers mount volumes at boot time, not at build time, in order to maintain portability from host to host. If you try to mount a volume on a mount point inside your container, the contents of the mounted volume will overwrite any files or directories that might have previously existed in your mount point.

This makes installing application dependencies at build time (e.g. running npm install, pip or whatever package manager you use) a little tricky. They key is to install dependencies in a separate directory from your volume mount point, so they don't get overwritten when the container boots. You can then either modify your application to look for dependencies wherever you installed them, or you can copy the dependencies to your mounted volume before starting your application. Note that any changes to your mounted volume will be reflected in your host directory, which isn't desirable. Neither is having a non-standard deployment directory structure. TODO: decide on the best approach.

Here, ./app/Dockerfile installs dependencies in /opt/app in the container at build time. At boot time, docker-compose.yml mounts the ./app directory in the host (project root) on the /src/app volume in the appsvr container and then runs /src/app/start.sh in the container, which copies the node_modules directory from /opt/app to /src/app. In doing so, ./app/node_modules will also be created in the host.

## Working in the Environment

### Development Workflow

This environment is designed to support GitHub Flow, which is described in more detail here: [GitHub Flow](http://scottchacon.com/2011/08/31/github-flow.html). GitHub Flow works for Web applications that don't have traditional releases but instead aim to continuously deploy smaller changes to production as often as several times a day. Here's a summary:

- Pull from the upstream repo to make sure your local copy is in sync.
- Create a local feature branch.
- Develop the new feature and all necessary unit and functional tests. We're not dogmatic about whether you should do so in a test-first manner; use your judgement. But do write automated tests.
- On save, tests will automatically run and the application will automatically reload in the container. Repeat the code/test cycle until the test passes.
    - TODO: look for clock skew issues in container
- Frequently commit your changes.
- Push your changes to a Github feature branch of the same name at least once a day.
- Travis will run tests automatically on push (move this to on opening a pull request?)
- Repeat until you’re ready to merge your commits (remember to frequently rebase with upstream master)
- Push to Github and open a pull request
- Review and merge the pull request to staging branch to deploy to staging environment
- Acceptance test and merge the pull request to production branch to deploy to production environment
- TODO:
    - Deploy to AWS staging and production

### Working with Docker Containers

You can find lots of useful information about Docker containers here:

- https://docs.docker.com/userguide/usingdocker/
- https://github.com/wsargent/docker-cheat-sheet

Here are some useful Docker commands that you can run from your host, assuming your containers are running in a VM under Vagrant. Make sure that you run these from your project root directory, where your Vagrantfile is located.

To ssh to your VM (it's just a Linux host):

```bash
$ vagrant ssh
```

To show the Docker containers that are currently running:

```bash
$ vagrant ssh -c 'docker ps'
```

To tail the log files from your containers:

```bash
$ vagrant ssh -c 'docker logs -f nodeapptemplate_appsvr_1'
$ vagrant ssh -c 'docker logs -f nodeapptemplate_nginx_1'
```

To open a shell in your Docker container

```bash
$ vagrant ssh -c 'docker exec -i -t nodeapptemplate_appsvr_1 bash'
```

To rebuild a container after changing a Dockerfile:

```bash
$ TODO
```

## Setting Up Your Project

### Setting Up Your Own Repo

If you want to contribute to this project, please fork this repo. If you want to build an application using this project as a foundation or if you want to create a template for a different Web framework:

```bash
$ git clone git@github.com:thehackerati/node-app-template.git my-repo-name
$ cd my-repo-name
```

Create a new repo on Github. Let's call it me/my-repo-name. Then push to your new repo:

```bash
$ git remote set-url origin git@github.com:me/my-repo-name.git
$ git push -u origin master
```

Add a staging branch to your repo on Github:

```bash
$ git checkout -b staging
$ git push -u origin staging
```

### Setting Up Continuous Integration

You'll need to setup your own continous integration service. This repo comes with [TravisCI](http://www.travis-ci.org) already configured. Once you've pushed your code to Github, login into Travis and connect it to your repo. By default, your first build will happen the next time that you push this repo to Github.

#### Install Travis CLI

Make sure you have at least Ruby 1.9.3 (2.0.0 recommended) installed.

You can check your Ruby version like this:

```bash
$ ruby -v
ruby 2.1.6p336 (2015-04-13 revision 50298) [x86_64-linux-gnu]
```

Install Travis CLI and make sure it works:

```bash
$ gem install travis -v 1.8.0 --no-rdoc --no-ri
$ travis version
1.8.0
```

#### Enter your AWS Access Key ID and Secret Access Key:

You can find your AWS keys here: https://console.aws.amazon.com/iam/home?#security_credential

The Access Key ID acts as a username and does not need to be encrypted. You can replace the access_key_id property in .travis.yml with your Access Key ID.

The Secret Access Key acts as a password and should be encrypted in the .travis.yml file. To generate an encrypted AWS secret access key:

```bash
$ travis encrypt --add deploy.secret_access_key
```

You'll be prompted to paste your secret key. This will place the new encrypted key at the end of the .travis.yml file:

```bash
  secret_access_key:
    secure: <key>
```

Make sure your Github repository and AWS environment names match your configuration.

To validate your .travis.yml file, install Travis Lint:

```bash
$ sudo gem install travis-lint
```

Create an AWS S3 bucket and directories for deployment. This appears to fail silently if you forget to do it, so don't forget!

### Setting Up AWS Elastic Beanstalk on Local Development Environment

NOTE: This is only relevant on the Docker Host (e.g. Linux).

Install Elastic Beanstalk CLI

TODO: Add EB CLI install to Vagrantfile for Mac. Then vagrant ssh

Clone the repo and run the environment locally:

```bash
$ git clone git@github.com:thehackerati/node-app-template.git
$ cd node-app-template
$ eb init
$ eb local run
```

Test the local environment:

```bash
$ curl http://127.0.0.1
```

### Setting Up AWS Production Environment

```bash
$ eb create
WARNING: The Multi-container Docker platform requires additional ECS permissions. Add the permissions to the aws-elasticbeanstalk-ec2-role or use your own instance profile by typing "-ip {profile-name}".
For more information see: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_docker_ecstutorial.html#create_deploy_docker_ecstutorial_role
Enter Environment Name
(default is node-app-template-dev): nodeAppTemplateProd
Enter DNS CNAME prefix
(default is nodeAppTemplateProd):
lots of output...
```

Test the production environment:

```bash
$ curl http://nodeAppTemplateProd.elasticbeanstalk.com 
```

### Setting Up AWS Staging Environment

```bash
eb clone                    │
Enter name for Environment Clone
(default is my-cloned-env): nodeAppTemplateStaging
Enter DNS CNAME prefix
(default is nodeAppTemplateStaging):
lots of output...
```

Test the staging environment:

```bash
$ curl http://nodeAppTemplateStaging.elasticbeanstalk.com 
```

### Setting Up Automated Build and Deploy to AWS Elastic Beanstalk

Configure DockerHub to build staging and production repositories:

Add Repository -> Automated Build
Select your repository on Github

Type        Name        Dockerfile Location     Tag Name
Branch      staging     /app                    staging-latest
Branch      master      /app                    latest

## License
Copyright (c) 2015 The Hackerati. This software is licensed under the MIT License.
