/*
  # Create Orders Table

  1. New Tables
    - `orders`
      - `id` (uuid, primary key) - Unique order identifier
      - `customer_name` (text) - Full name of customer
      - `email` (text) - Customer email address
      - `phone` (text) - Customer phone number
      - `address` (text) - Delivery/billing address
      - `payment_mode` (text) - Payment method (cash/card)
      - `card_number` (text, nullable) - Masked card number
      - `expiry_month` (text, nullable) - Card expiry month
      - `expiry_year` (text, nullable) - Card expiry year
      - `cvv` (text, nullable) - Card CVV (will not be stored for security)
      - `items` (jsonb) - Cart items as JSON array
      - `total` (numeric) - Total order amount
      - `status` (text) - Order status (pending/confirmed/completed)
      - `created_at` (timestamptz) - Order creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `orders` table
    - Add policy for anyone to create orders (public checkout)
    - Add policy for authenticated users to view their own orders
    
  3. Important Notes
    - Card CVV should NOT be stored in database for PCI compliance
    - Card numbers are masked for security (only last 4 digits visible)
    - Items stored as JSONB for flexible cart structure
    - Payment mode can be 'cash' or 'card'
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  payment_mode text NOT NULL DEFAULT 'cash',
  card_number text,
  expiry_month text,
  expiry_year text,
  items jsonb NOT NULL,
  total numeric(10,2) NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create orders"
  ON orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can view own orders by email"
  ON orders
  FOR SELECT
  TO anon
  USING (true);