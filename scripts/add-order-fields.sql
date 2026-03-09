-- AddMissingOrderFields
-- Add missing fields to Order table

ALTER TABLE "Order" ADD COLUMN "number" TEXT;
ALTER TABLE "Order" ADD COLUMN "complement" TEXT;
ALTER TABLE "Order" ADD COLUMN "shippingMethod" TEXT;
