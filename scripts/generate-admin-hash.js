// Script para gerar o hash bcrypt da senha do admin
// Execute com: node scripts/generate-admin-hash.js

import bcrypt from 'bcryptjs';

const password = 'Mudar123';
const hash = bcrypt.hashSync(password, 10);

console.log('============================================');
console.log('Hash gerado para a senha do admin');
console.log('============================================');
console.log('Email: admin@oldinacloset.online');
console.log('Senha: Mudar123');
console.log('Hash bcrypt:', hash);
console.log('');
console.log('Execute este SQL para atualizar a senha:');
console.log('');
console.log(`UPDATE "User" SET "password" = '${hash}' WHERE "email" = 'admin@oldinacloset.online';`);
console.log('============================================');
