/*
  # Update RLS policies for admin access

  ## Changes
  - Allows anonymous users to insert, update, and delete listings
  - This enables the admin panel to work without authentication
  - In production, you should add proper authentication

  ## Security Note
  - These policies are permissive for development purposes
  - For production use, implement proper authentication and restrict policies
*/

DROP POLICY IF EXISTS "Authenticated users can insert listings" ON listings;
DROP POLICY IF EXISTS "Authenticated users can update listings" ON listings;
DROP POLICY IF EXISTS "Authenticated users can delete listings" ON listings;

CREATE POLICY "Anyone can insert listings"
  ON listings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update listings"
  ON listings
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete listings"
  ON listings
  FOR DELETE
  TO anon, authenticated
  USING (true);