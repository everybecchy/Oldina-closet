-- Ondina Closet - Migration: Adicionar novas features
-- Execute após o setup-database.sql inicial

-- Adicionar campo isAdmin na tabela User (substituir role)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isAdmin" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phone" TEXT;

-- Adicionar campos na tabela Order
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "neighborhood" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "discount" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "couponCode" TEXT;

-- Tabela de Banners
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

-- Tabela de Vídeos
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

-- Tabela de Cupons
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

-- Enum para status de pagamento
DO $$ BEGIN
    CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tabela de Pagamentos
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

-- Foreign key de Payment para Order
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" 
FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Atualizar admin existente para usar isAdmin em vez de role
UPDATE "User" SET "isAdmin" = true WHERE "role" = 'ADMIN';

-- Inserir/Atualizar usuário admin principal
INSERT INTO "User" ("id", "email", "password", "name", "isAdmin", "createdAt", "updatedAt")
VALUES (
    'admin-oldina-closet',
    'admin@oldinacloset.online',
    '$2a$10$dRQMCZnBgT3nB8uqFJCGfeX.Ij.gk/HLHkrj2f.ZmVXqM7B1CUBmO',
    'Administrador Oldina Closet',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("email") DO UPDATE SET
    "isAdmin" = true,
    "password" = '$2a$10$dRQMCZnBgT3nB8uqFJCGfeX.Ij.gk/HLHkrj2f.ZmVXqM7B1CUBmO',
    "updatedAt" = CURRENT_TIMESTAMP;

-- Inserir alguns banners de exemplo
INSERT INTO "Banner" ("id", "title", "subtitle", "image", "link", "active", "order", "createdAt", "updatedAt")
VALUES 
    ('banner-1', 'Nova Coleção', 'Descubra as joias mais elegantes', '/images/banner-1.jpg', '/produtos', true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('banner-2', 'Promoção de Verão', 'Até 30% de desconto', '/images/banner-2.jpg', '/promocoes', true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;
