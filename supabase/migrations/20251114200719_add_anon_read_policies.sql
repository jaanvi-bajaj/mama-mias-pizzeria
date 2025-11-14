/*
  # Add Anonymous Read Policies for Database Viewer

  1. Security Changes
    - Add SELECT policies for anon users to view all data
    - This enables the public database viewer page to work
    - Existing authenticated policies remain unchanged
  
  2. Tables Affected
    - menu_items: Allow anon to view all items (not just available)
    - reservations: Allow anon to view reservations
    - contact_messages: Allow anon to view contact messages
*/

-- Menu Items: Allow anon to view ALL menu items (not just available ones)
CREATE POLICY "Anon can view all menu items"
  ON menu_items FOR SELECT
  TO anon
  USING (true);

-- Reservations: Allow anon to view reservations
CREATE POLICY "Anon can view reservations"
  ON reservations FOR SELECT
  TO anon
  USING (true);

-- Contact Messages: Allow anon to view contact messages
CREATE POLICY "Anon can view contact messages"
  ON contact_messages FOR SELECT
  TO anon
  USING (true);

-- Comments: Allow anon to view ALL comments (not just approved)
CREATE POLICY "Anon can view all comments"
  ON comments FOR SELECT
  TO anon
  USING (true);
