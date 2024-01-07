#!/bin/sh

export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1

npm start -- -p $PORT 