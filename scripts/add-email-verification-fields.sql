-- Migration: Add email verification and password reset fields to User table
-- Run this script on your PostgreSQL database

-- Add email verification fields
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerified" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "verificationToken" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordResetToken" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordResetExpires" TIMESTAMP(3);

-- Create unique indexes for tokens
CREATE UNIQUE INDEX IF NOT EXISTS "User_verificationToken_key" ON "User"("verificationToken");
CREATE UNIQUE INDEX IF NOT EXISTS "User_passwordResetToken_key" ON "User"("passwordResetToken");

-- Create Newsletter table if not exists
CREATE TABLE IF NOT EXISTS "Newsletter" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id")
);

-- Create unique index for newsletter email
CREATE UNIQUE INDEX IF NOT EXISTS "Newsletter_email_key" ON "Newsletter"("email");

-- Update existing users to have emailVerified set (so they can login)
-- This sets emailVerified to NOW() for all existing users
UPDATE "User" SET "emailVerified" = NOW() WHERE "emailVerified" IS NULL;

-- Update admin user to ensure they can login
UPDATE "User" SET "emailVerified" = NOW() WHERE "email" = 'admin@oldinacloset.online' AND "emailVerified" IS NULL;
