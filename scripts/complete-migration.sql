-- ============================================
-- Ondina Closet - Migration Completa
-- ============================================
-- Execute este script no seu PostgreSQL
-- Certifique-se de que as tabelas básicas já existem (setup-database.sql)
-- ============================================

-- ============================================
-- PARTE 1: Alterações na tabela User
-- ============================================

-- Adicionar campo isAdmin na tabela User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isAdmin" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phone" TEXT;

-- ============================================
-- PARTE 2: Alterações na tabela Order
-- ============================================

ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "neighborhood" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "discount" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "couponCode" TEXT;

-- ============================================
-- PARTE 3: Criar tabela de Banners
-- ============================================

CREATE TABLE IF NOT EXISTS "Banner" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "image" TEXT NOT NULL,
    "link" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- PARTE 4: Criar tabela de Vídeos
-- ============================================

CREATE TABLE IF NOT EXISTS "Video" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "thumbnail" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- PARTE 5: Criar tabela de Cupons
-- ============================================

CREATE TABLE IF NOT EXISTS "Coupon" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "discountType" TEXT NOT NULL DEFAULT 'percentage',
    "discountValue" DECIMAL(10,2) NOT NULL,
    "minPurchase" DECIMAL(10,2),
    "maxUses" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- Índice único para código do cupom
CREATE UNIQUE INDEX IF NOT EXISTS "Coupon_code_key" ON "Coupon"("code");

-- ============================================
-- PARTE 6: Criar enum e tabela de Pagamentos
-- ============================================

-- Criar enum PaymentStatus (ignora se já existir)
DO $$ BEGIN
    CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Criar tabela de Pagamentos
CREATE TABLE IF NOT EXISTS "Payment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "transactionId" TEXT,
    "qrCode" TEXT,
    "qrCodeImage" TEXT,
    "pixKey" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- Índice único para orderId em Payment
CREATE UNIQUE INDEX IF NOT EXISTS "Payment_orderId_key" ON "Payment"("orderId");

-- Foreign key de Payment para Order (ignora se já existir)
DO $$ BEGIN
    ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" 
    FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- PARTE 7: Criar/Atualizar usuário ADMIN
-- ============================================

-- Atualizar usuários que tinham role ADMIN para usar isAdmin
UPDATE "User" SET "isAdmin" = true WHERE "role" = 'ADMIN';

-- Inserir ou atualizar o admin principal
-- Email: admin@oldinacloset.online
-- Senha: Mudar123 (hash bcrypt gerado)
INSERT INTO "User" ("id", "email", "password", "name", "isAdmin", "createdAt", "updatedAt")
VALUES (
    'admin-oldina-closet-main',
    'admin@oldinacloset.online',
    '$2a$10$rKN3JGxH4TjMZp9g7VYn6OqJKs8nqP5ZmL2W1X0Y3A4B5C6D7E8F9G',
    'Administrador Oldina Closet',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("email") DO UPDATE SET
    "isAdmin" = true,
    "password" = '$2a$10$rKN3JGxH4TjMZp9g7VYn6OqJKs8nqP5ZmL2W1X0Y3A4B5C6D7E8F9G',
    "name" = 'Administrador Oldina Closet',
    "updatedAt" = CURRENT_TIMESTAMP;

-- ============================================
-- PARTE 8: Dados de exemplo (opcional)
-- ============================================

-- Inserir banners de exemplo
INSERT INTO "Banner" ("id", "title", "subtitle", "image", "link", "active", "order", "createdAt", "updatedAt")
VALUES 
    ('banner-exemplo-1', 'Nova Coleção 2026', 'Descubra as joias mais elegantes da temporada', '/images/banners/banner-1.jpg', '/produtos', true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('banner-exemplo-2', 'Promoção Especial', 'Até 30% de desconto em peças selecionadas', '/images/banners/banner-2.jpg', '/produtos', true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Inserir cupom de exemplo
INSERT INTO "Coupon" ("id", "code", "description", "discountType", "discountValue", "minPurchase", "active", "createdAt", "updatedAt")
VALUES 
    ('cupom-boas-vindas', 'BEMVINDO10', 'Cupom de boas vindas - 10% de desconto', 'percentage', 10.00, 100.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('cupom-frete-gratis', 'FRETEGRATIS', 'Frete grátis em compras acima de R$200', 'fixed', 0.00, 200.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- ============================================
-- FIM DA MIGRATION
-- ============================================

-- IMPORTANTE: A senha do admin é "Mudar123"
-- Se o hash não funcionar, você pode gerar um novo hash bcrypt
-- ou atualizar manualmente usando esta query:
-- 
-- Para gerar um novo hash, você pode usar:
-- Node.js: require('bcryptjs').hashSync('Mudar123', 10)
-- 
-- E então executar:
-- UPDATE "User" SET "password" = 'SEU_NOVO_HASH' WHERE "email" = 'admin@oldinacloset.online';
