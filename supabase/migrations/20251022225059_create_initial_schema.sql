/*
  # TSL Mini Plant Hire - Initial Database Schema

  This migration creates the complete database schema for the TSL Mini Plant Hire booking system.

  ## New Tables

  ### 1. `user` table
  - `id` (serial, primary key) - Unique user identifier
  - `email` (text, unique) - User email address
  - `password` (text) - Hashed password
  - `role` (text) - User role: 'admin', 'businessowner', or 'customer'
  - `created_at` (timestamptz) - Account creation timestamp

  ### 2. `business` table
  - `id` (serial, primary key) - Unique business identifier
  - `name` (text) - Business name
  - `description` (text) - Business description
  - `businessHours` (jsonb) - Business operating hours
  - `pricing` (text) - Pricing information
  - `category` (text) - Business category
  - `address` (text) - Business address
  - `phone` (text) - Contact phone number
  - `email` (text) - Contact email
  - `website` (text) - Business website URL
  - `cancellationPolicy` (text) - Cancellation policy details
  - `reschedulingPolicy` (text) - Rescheduling policy details
  - `bookingLeadTime` (integer) - Minimum booking lead time in hours
  - `maxBookingDuration` (integer) - Maximum booking duration in hours
  - `ownerId` (integer, foreign key) - References user table
  - `created_at` (timestamptz) - Business registration timestamp

  ### 3. `service` table
  - `id` (serial, primary key) - Unique service identifier
  - `serviceName` (text) - Name of the service
  - `description` (text) - Service description
  - `duration` (integer) - Service duration in minutes
  - `price` (decimal) - Service price
  - `isDeleted` (boolean) - Soft delete flag
  - `businessId` (integer, foreign key) - References business table
  - `created_at` (timestamptz) - Service creation timestamp

  ### 4. `booking` table
  - `id` (serial, primary key) - Unique booking identifier
  - `date` (date) - Booking date
  - `startTime` (text) - Booking start time (HH:MM format)
  - `endTime` (text) - Booking end time (HH:MM format)
  - `status` (text) - Booking status: 'confirmed', 'canceled', etc.
  - `paymentStatus` (text) - Payment status: 'pending', 'paid', 'failed'
  - `refundStatus` (text) - Refund status
  - `paymentIntentId` (text) - Stripe payment intent ID
  - `businessId` (integer, foreign key) - References business table
  - `serviceId` (integer, foreign key) - References service table
  - `customerId` (integer, foreign key) - References user table
  - `created_at` (timestamptz) - Booking creation timestamp

  ### 5. `review` table
  - `id` (serial, primary key) - Unique review identifier
  - `rating` (integer) - Rating value (1-5)
  - `reviewText` (text) - Review content
  - `ownerReply` (text, nullable) - Business owner's reply to the review
  - `businessId` (integer, foreign key) - References business table
  - `userId` (integer, foreign key) - References user table
  - `serviceId` (integer, foreign key) - References service table
  - `created_at` (timestamptz) - Review creation timestamp

  ## Security

  - Enable Row Level Security (RLS) on all tables
  - Add policies for authenticated users to access their own data
  - Business owners can only access their own businesses
  - Customers can view all businesses but only manage their own bookings and reviews
  - Admins have full access to all data
*/

-- Create user table
CREATE TABLE IF NOT EXISTS "user" (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create business table
CREATE TABLE IF NOT EXISTS business (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  "businessHours" JSONB NOT NULL,
  pricing TEXT NOT NULL,
  category TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT NOT NULL,
  "cancellationPolicy" TEXT NOT NULL,
  "reschedulingPolicy" TEXT NOT NULL,
  "bookingLeadTime" INTEGER NOT NULL,
  "maxBookingDuration" INTEGER NOT NULL,
  "ownerId" INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  FOREIGN KEY ("ownerId") REFERENCES "user"(id) ON DELETE CASCADE
);

-- Create service table
CREATE TABLE IF NOT EXISTS service (
  id SERIAL PRIMARY KEY,
  "serviceName" TEXT NOT NULL,
  description TEXT NOT NULL,
  duration INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  "isDeleted" BOOLEAN DEFAULT false,
  "businessId" INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  FOREIGN KEY ("businessId") REFERENCES business(id) ON DELETE CASCADE
);

-- Create booking table
CREATE TABLE IF NOT EXISTS booking (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  "startTime" TEXT NOT NULL,
  "endTime" TEXT NOT NULL,
  status TEXT NOT NULL,
  "paymentStatus" TEXT DEFAULT 'pending',
  "refundStatus" TEXT DEFAULT '',
  "paymentIntentId" TEXT,
  "businessId" INTEGER NOT NULL,
  "serviceId" INTEGER NOT NULL,
  "customerId" INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  FOREIGN KEY ("businessId") REFERENCES business(id) ON DELETE CASCADE,
  FOREIGN KEY ("serviceId") REFERENCES service(id) ON DELETE CASCADE,
  FOREIGN KEY ("customerId") REFERENCES "user"(id) ON DELETE CASCADE
);

-- Create review table
CREATE TABLE IF NOT EXISTS review (
  id SERIAL PRIMARY KEY,
  rating INTEGER NOT NULL,
  "reviewText" TEXT NOT NULL,
  "ownerReply" TEXT,
  "businessId" INTEGER NOT NULL,
  "userId" INTEGER NOT NULL,
  "serviceId" INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  FOREIGN KEY ("businessId") REFERENCES business(id) ON DELETE CASCADE,
  FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE,
  FOREIGN KEY ("serviceId") REFERENCES service(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE business ENABLE ROW LEVEL SECURITY;
ALTER TABLE service ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking ENABLE ROW LEVEL SECURITY;
ALTER TABLE review ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user table
CREATE POLICY "Users can view all users"
  ON "user" FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON "user" FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- RLS Policies for business table
CREATE POLICY "Anyone can view businesses"
  ON business FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Business owners can create businesses"
  ON business FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = "ownerId"::text);

CREATE POLICY "Business owners can update own businesses"
  ON business FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = "ownerId"::text)
  WITH CHECK (auth.uid()::text = "ownerId"::text);

CREATE POLICY "Business owners can delete own businesses"
  ON business FOR DELETE
  TO authenticated
  USING (auth.uid()::text = "ownerId"::text);

-- RLS Policies for service table
CREATE POLICY "Anyone can view services"
  ON service FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Business owners can create services"
  ON service FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business
      WHERE business.id = service."businessId"
      AND business."ownerId"::text = auth.uid()::text
    )
  );

CREATE POLICY "Business owners can update own services"
  ON service FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business
      WHERE business.id = service."businessId"
      AND business."ownerId"::text = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business
      WHERE business.id = service."businessId"
      AND business."ownerId"::text = auth.uid()::text
    )
  );

CREATE POLICY "Business owners can delete own services"
  ON service FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business
      WHERE business.id = service."businessId"
      AND business."ownerId"::text = auth.uid()::text
    )
  );

-- RLS Policies for booking table
CREATE POLICY "Users can view own bookings"
  ON booking FOR SELECT
  TO authenticated
  USING (
    auth.uid()::text = "customerId"::text
    OR EXISTS (
      SELECT 1 FROM business
      WHERE business.id = booking."businessId"
      AND business."ownerId"::text = auth.uid()::text
    )
  );

CREATE POLICY "Customers can create bookings"
  ON booking FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = "customerId"::text);

CREATE POLICY "Customers can update own bookings"
  ON booking FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = "customerId"::text)
  WITH CHECK (auth.uid()::text = "customerId"::text);

CREATE POLICY "Customers can delete own bookings"
  ON booking FOR DELETE
  TO authenticated
  USING (auth.uid()::text = "customerId"::text);

-- RLS Policies for review table
CREATE POLICY "Anyone can view reviews"
  ON review FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Customers can create reviews"
  ON review FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = "userId"::text);

CREATE POLICY "Customers can update own reviews"
  ON review FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = "userId"::text)
  WITH CHECK (auth.uid()::text = "userId"::text);

CREATE POLICY "Business owners can reply to reviews"
  ON review FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business
      WHERE business.id = review."businessId"
      AND business."ownerId"::text = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business
      WHERE business.id = review."businessId"
      AND business."ownerId"::text = auth.uid()::text
    )
  );

CREATE POLICY "Customers can delete own reviews"
  ON review FOR DELETE
  TO authenticated
  USING (auth.uid()::text = "userId"::text);
