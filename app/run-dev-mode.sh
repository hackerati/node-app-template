#!/bin/sh

# Copy node_modules to the host's project root on the /src/app volume
cp -a /tmp/app/node_modules /src/app && npm test
