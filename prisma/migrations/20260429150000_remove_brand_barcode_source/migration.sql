DROP INDEX IF EXISTS "products_barcode_key";

ALTER TABLE "products"
  DROP COLUMN IF EXISTS "brand",
  DROP COLUMN IF EXISTS "barcode";

ALTER TABLE "day_entries"
  DROP COLUMN IF EXISTS "source";
