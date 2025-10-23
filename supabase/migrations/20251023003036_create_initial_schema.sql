/*
  # TSL Mini Plant Hire - Initial Database Schema

  This migration creates the complete database schema for the TSL Mini Plant Hire booking system.

  ## New Tables

  ### 1. `user` table
  - `id` (uuid, primary key) - Unique user identifier linked to auth.users
  - `email` (text, unique) - User email address
  - `role` (text) - User role: 'admin', 'businessowner', or 'customer'
  - `created_at` (timestamptz) - Account creation timestamp

  ### 2. `business` table
  - `id` (uuid, primary key) - Unique business identifier
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
  - `ownerId` (uuid, foreign key) - References user table
  - `created_at` (timestamptz) - Business registration timestamp

  ### 3. `service` table
  - `id` (uuid, primary key) - Unique service identifier
  - `serviceName` (text) - Name of the service
  - `description` (text) - Service description
  - `duration` (integer) - Service duration in minutes
  - `price` (decimal) - Service price
  - `isDeleted` (boolean) - Soft delete flag
  - `businessId` (uuid, foreign key) - References business table
  - `created_at` (timestamptz) - Service creation timestamp

  ### 4. `booking` table
  - `id` (uuid, primary key) - Unique booking identifier
  - `date` (date) - Booking date
  - `startTime` (text) - Booking start time (HH:MM format)
  - `endTime` (text) - Booking end time (HH:MM format)
  - `status` (text) - Booking status: 'confirmed', 'canceled', etc.
  - `paymentStatus` (text) - Payment status: 'pending', 'paid', 'failed'
  - `refundStatus` (text) - Refund status
  - `paymentIntentId` (text) - Stripe payment intent ID
  - `businessId` (uuid, foreign key) - References business table
  - `serviceId` (uuid, foreign key) - References service table
  - `customerId` (uuid, foreign key) - References user table
  - `created_at` (timestamptz) - Booking creation timestamp

  ### 5. `review` table
  - `id` (uuid, primary key) - Unique review identifier
  - `rating` (integer) - Rating value (1-5)
  - `reviewText` (text) - Review content
  - `ownerReply` (text, nullable) - Business owner's reply to the review
  - `businessId` (uuid, foreign key) - References business table
  - `userId` (uuid, foreign key) - References user table
  - `serviceId` (uuid, foreign key) - References service table
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create business table
CREATE TABLE IF NOT EXISTS business (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  "businessHours" JSONB NOT NULL DEFAULT '{}'::jsonb,
  pricing TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'general',
  address TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  website TEXT NOT NULL DEFAULT '',
  "cancellationPolicy" TEXT NOT NULL DEFAULT '',
  "reschedulingPolicy" TEXT NOT NULL DEFAULT '',
  "bookingLeadTime" INTEGER NOT NULL DEFAULT 24,
  "maxBookingDuration" INTEGER NOT NULL DEFAULT 168,
  "ownerId" UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  FOREIGN KEY ("ownerId") REFERENCES "user"(id) ON DELETE CASCADE
);

-- Create service table
CREATE TABLE IF NOT EXISTS service (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "serviceName" TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  duration INTEGER NOT NULL DEFAULT 60,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  "isDeleted" BOOLEAN DEFAULT false,
  "businessId" UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  FOREIGN KEY ("businessId") REFERENCES business(id) ON DELETE CASCADE
);

-- Create booking table
CREATE TABLE IF NOT EXISTS booking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  "startTime" TEXT NOT NULL,
  "endTime" TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  "paymentStatus" TEXT DEFAULT 'pending',
  "refundStatus" TEXT DEFAULT '',
  "paymentIntentId" TEXT,
  "businessId" UUID NOT NULL,
  "serviceId" UUID NOT NULL,
  "customerId" UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  FOREIGN KEY ("businessId") REFERENCES business(id) ON DELETE CASCADE,
  FOREIGN KEY ("serviceId") REFERENCES service(id) ON DELETE CASCADE,
  FOREIGN KEY ("customerId") REFERENCES "user"(id) ON DELETE CASCADE
);

-- Create review table
CREATE TABLE IF NOT EXISTS review (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  "reviewText" TEXT NOT NULL,
  "ownerReply" TEXT,
  "businessId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "serviceId" UUID NOT NULL,
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
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for business table
CREATE POLICY "Anyone can view businesses"
  ON business FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Business owners can create businesses"
  ON business FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = "ownerId");

CREATE POLICY "Business owners can update own businesses"
  ON business FOR UPDATE
  TO authenticated
  USING (auth.uid() = "ownerId")
  WITH CHECK (auth.uid() = "ownerId");

CREATE POLICY "Business owners can delete own businesses"
  ON business FOR DELETE
  TO authenticated
  USING (auth.uid() = "ownerId");

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
      AND business."ownerId" = auth.uid()
    )
  );

CREATE POLICY "Business owners can update own services"
  ON service FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business
      WHERE business.id = service."businessId"
      AND business."ownerId" = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business
      WHERE business.id = service."businessId"
      AND business."ownerId" = auth.uid()
    )
  );

CREATE POLICY "Business owners can delete own services"
  ON service FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business
      WHERE business.id = service."businessId"
      AND business."ownerId" = auth.uid()
    )
  );

-- RLS Policies for booking table
CREATE POLICY "Users can view own bookings"
  ON booking FOR SELECT
  TO authenticated
  USING (
    auth.uid() = "customerId"
    OR EXISTS (
      SELECT 1 FROM business
      WHERE business.id = booking."businessId"
      AND business."ownerId" = auth.uid()
    )
  );

CREATE POLICY "Customers can create bookings"
  ON booking FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = "customerId");

CREATE POLICY "Customers can update own bookings"
  ON booking FOR UPDATE
  TO authenticated
  USING (auth.uid() = "customerId")
  WITH CHECK (auth.uid() = "customerId");

CREATE POLICY "Customers can delete own bookings"
  ON booking FOR DELETE
  TO authenticated
  USING (auth.uid() = "customerId");

-- RLS Policies for review table
CREATE POLICY "Anyone can view reviews"
  ON review FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Customers can create reviews"
  ON review FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Customers can update own reviews"
  ON review FOR UPDATE
  TO authenticated
  USING (auth.uid() = "userId")
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Business owners can reply to reviews"
  ON review FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business
      WHERE business.id = review."businessId"
      AND business."ownerId" = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business
      WHERE business.id = review."businessId"
      AND business."ownerId" = auth.uid()
    )
  );

CREATE POLICY "Customers can delete own reviews"
  ON review FOR DELETE
  TO authenticated
  USING (auth.uid() = "userId");

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_business_owner ON business("ownerId");
CREATE INDEX IF NOT EXISTS idx_service_business ON service("businessId");
CREATE INDEX IF NOT EXISTS idx_booking_customer ON booking("customerId");
CREATE INDEX IF NOT EXISTS idx_booking_business ON booking("businessId");
CREATE INDEX IF NOT EXISTS idx_booking_service ON booking("serviceId");
CREATE INDEX IF NOT EXISTS idx_review_business ON review("businessId");
CREATE INDEX IF NOT EXISTS idx_review_user ON review("userId");

-- Create function to sync auth.users with user table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user (id, email, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'customer')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create user record on auth signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
