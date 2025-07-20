#!/bin/sh

./wait-for-it.sh db:3306 --timeout=60 --strict -- echo "DB is up"
npm run db:migrate
npm run start