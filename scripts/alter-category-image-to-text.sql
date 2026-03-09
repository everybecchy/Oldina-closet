-- Altera o campo image da tabela Category para TEXT (suporta strings maiores como base64)
ALTER TABLE "Category" ALTER COLUMN "image" TYPE TEXT;
