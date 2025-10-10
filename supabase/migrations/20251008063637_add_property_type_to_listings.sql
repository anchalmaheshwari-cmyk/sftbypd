/*
  # Add property type to listings

  1. Changes
    - Add `property_type` column to `listings` table
      - Type: text
      - Allowed values: 'Rental', 'Purchase', 'Commercial Rental'
      - Default: 'Purchase'
      - Not null constraint
    
  2. Notes
    - This allows categorizing properties by their transaction type
    - Existing records will be set to 'Purchase' by default
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'property_type'
  ) THEN
    ALTER TABLE listings ADD COLUMN property_type text NOT NULL DEFAULT 'Purchase';
    
    ALTER TABLE listings ADD CONSTRAINT property_type_check 
      CHECK (property_type IN ('Rental', 'Purchase', 'Commercial Rental'));
  END IF;
END $$;