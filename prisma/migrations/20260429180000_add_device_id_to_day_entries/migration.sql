-- Add device_id column to day_entries and index
ALTER TABLE "day_entries" ADD COLUMN "device_id" text NOT NULL DEFAULT '';
CREATE INDEX "day_entries_device_id_eaten_at_idx" ON "day_entries" ("device_id", "eaten_at");

-- If you prefer NULLable column instead of default empty string, remove DEFAULT and allow NULLs.
