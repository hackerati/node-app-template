FROM node:0.10.38

RUN mkdir /src

RUN npm install nodemon -g && \
    npm install grunt-cli -g

WORKDIR /src
ADD package.json package.json
RUN npm install

ADD Gruntfile.js Gruntfile.js

ADD nodemon.json nodemon.json
