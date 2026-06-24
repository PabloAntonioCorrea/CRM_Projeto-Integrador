#!/bin/sh
set -e

echo "Aplicando migrations..."
npx prisma migrate deploy

echo "Verificando seed inicial..."
node prisma/ensureSeed.js

echo "Iniciando API..."
exec npm start
