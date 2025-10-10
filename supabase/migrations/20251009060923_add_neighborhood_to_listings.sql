/*
  # Add Neighborhood Information to Listings

  ## Changes
  1. Add `neighborhood` column to listings table
     - Type: text
     - Nullable: true (to support existing listings)
     - Description: Stores information about nearby amenities like schools, hospitals, shopping centers, etc.

  ## Notes
  - Existing listings will have NULL neighborhood values initially
  - This field can be populated through the admin interface
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'neighborhood'
  ) THEN
    ALTER TABLE listings ADD COLUMN neighborhood text;
  END IF;
END $$;