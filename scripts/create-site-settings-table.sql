-- Criar tabela SiteSettings para configuracoes editaveis do site
CREATE TABLE IF NOT EXISTS "SiteSettings" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "heroTagline" TEXT,
  "heroTitle" TEXT,
  "heroTitleAccent" TEXT,
  "heroDescription" TEXT,
  "heroImage" TEXT,
  "heroStat1Value" TEXT,
  "heroStat1Label" TEXT,
  "heroStat2Value" TEXT,
  "heroStat2Label" TEXT,
  "heroStat3Value" TEXT,
  "heroStat3Label" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- Criar indice unico na coluna key
CREATE UNIQUE INDEX IF NOT EXISTS "SiteSettings_key_key" ON "SiteSettings"("key");

-- Inserir configuracao padrao do hero
INSERT INTO "SiteSettings" (
  "id", 
  "key", 
  "heroTagline", 
  "heroTitle", 
  "heroTitleAccent", 
  "heroDescription",
  "heroStat1Value",
  "heroStat1Label",
  "heroStat2Value",
  "heroStat2Label",
  "heroStat3Value",
  "heroStat3Label",
  "updatedAt"
) VALUES (
  'site-hero-settings',
  'hero',
  'Colecao Exclusiva',
  'Elegancia que',
  'brilha em voce',
  'Descubra joias exclusivas criadas para mulheres que apreciam a sofisticacao nos detalhes.',
  '500+',
  'Pecas Exclusivas',
  '5k+',
  'Clientes Felizes',
  '100%',
  'Garantia',
  CURRENT_TIMESTAMP
) ON CONFLICT ("key") DO NOTHING;
