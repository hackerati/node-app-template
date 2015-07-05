################################################################################
# Dockerfile to build node-app-template container image
# 
# Directories:
# /opt/app - working dir for container, dependencies installed on image build
# /src/app - source tree volume, synchronized with host
#
# Whenever the container is built:
# 1. npm install is re-run, generating a new /opt/app/node_modules directory
#
# Every time the container runs:
# 1. The /src/app volume gets mounted by docker-compose
# 2. The node_modules directory gets copied /opt/app to /src/app by start.sh
#
# Commands are called from docker-compose, execute in WORKDIR:
# npm start -> node start
# npm test -> grunt -> concurrent (nodemon, watch[jshint, jasmine_node])
 
################################################################################

FROM node:0.10.38

RUN npm install nodemon -g && \
    npm install grunt-cli -g

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD package.json /tmp/app/package.json
RUN cd /tmp/app && npm install

# Perhaps mkdir is unnecessary given the cp?
RUN mkdir -p /opt/app && cp -a /tmp/app /opt

# From here we load our application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible
WORKDIR /src/app
