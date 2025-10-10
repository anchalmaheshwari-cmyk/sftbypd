/*
  # Add featured property support

  1. Changes
    - Add `featured` boolean column to `listings` table
    - Default value is false
    - Add index for faster featured property queries

  2. Notes
    - Only one property should be featured at a time (enforced in application logic)
    - Featured property will be displayed prominently on the homepage
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'featured'
  ) THEN
    ALTER TABLE listings ADD COLUMN featured boolean DEFAULT false;
    CREATE INDEX IF NOT EXISTS idx_listings_featured ON listings(featured);
  END IF;
END $$;
