#!/bin/bash

# Regenerar Prisma Client
echo "Regenerando Prisma Client..."
npx prisma generate

echo "Atualizando banco de dados..."
npx prisma db push

echo "Pronto! Prisma foi atualizado com sucesso."
