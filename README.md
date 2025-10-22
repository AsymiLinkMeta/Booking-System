<h1 align="center">TSL Mini Plant Hire</h1>

Welcome to TSL Mini Plant Hire! This project is designed to facilitate easy and efficient booking management for mini plant equipment hire, using a robust and scalable technology stack. It includes comprehensive features for user authentication, business and booking management, payment integration, and more.

## Table of Contents
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Installation](#installation)
4. [Deployment](#deployment)

## Features

1. **User Registration and Authentication**
    - Implement a user registration and login system using JWT (JSON Web Token).
  
2. **User Roles**
    - Define different roles such as Admin, Business Owner, and Customer.
    - Each role has access to their respective dashboard:
        - Business Owners have access to their own business dashboard.
        - Customers have access to their own customer dashboard.
        - Admins have access to their own admin dashboard.

3. **Business Management**
    - Allow business owners to register their businesses.
    - Enable business profile management including business hours, services offered, and pricing.
    - Provide business owners the ability to track customer bookings, including date, day, time, status, and payment status.
    - Allow business owners to view and reply to customer reviews.

4. **Booking Management**
    - Enable customers to view available businesses and book services.
    - Provide booking confirmation and cancellation features.
    - Include a calendar view and available hours for customers to manage bookings.

5. **Payment Integration**
    - Integrate [Stripe](https://stripe.com/) for customers to make payments.

6. **Reviews and Ratings**
    - Allow customers to leave reviews and ratings for businesses.

7. **Admin Dashboard**
    - Monitor all registered businesses, display user accounts, and track bookings.
    - Generate reports and analytics.

## Tech Stack

[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

[![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)

[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

[![Render](https://img.shields.io/badge/Render-0468D7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)

[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.io/)

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [PostgreSQL](https://www.postgresql.org/) installed
- A [Stripe](https://stripe.com/) account for payment integration

### Backend Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/chrispsang/Booking-System.git
    cd Booking-System/booking-system-backend
    ```

2. Install dependencies:
    ```sh
    npm install --legacy-peer-deps --no-optional
    ```

3. Set up the environment variables in a `.env` file:
    ```plaintext
    STRIPE_SECRET_KEY=your_stripe_secret_key
    DATABASE_HOST=aws-0-ap-southeast-2.pooler.supabase.com
    DATABASE_PORT=6543
    DATABASE_USERNAME=postgres.wvonfwtzomkucwmtylcq
    DATABASE_PASSWORD=your_supabase_password
    DATABASE_NAME=postgres
    JWT_SECRET=your-secret-key-change-this-in-production
    PORT=3000
    NODE_ENV=development
    ```

4. Run the backend server (default port 3000):
    ```sh
    npm run start:dev
    ```

    For production:
    ```sh
    npm run build
    npm run start:prod
    ```

### Frontend Setup

1. Navigate to the frontend directory:
    ```sh
    cd ../booking-system-frontend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up the environment variables:
    - For development: Create a `.env.development` file with the following content:
      ```plaintext
      REACT_APP_API_URL=http://localhost:3000
      REACT_APP_STRIPE_PUBLIC_KEY=
      ```
      
4. Run the frontend server (default port 3001):
    ```sh
    npm start
    ```

You can access the frontend at [http://localhost:3001](http://localhost:3001) for local development. The backend can be accessed at [http://localhost:3000](http://localhost:3000) for local development.

### Database Setup

The application uses Supabase PostgreSQL database. The database schema includes:

- **users** - User accounts with roles (admin, businessowner, customer)
- **businesses** - Business profiles with hours and services
- **services** - Services offered by businesses
- **bookings** - Customer bookings with status tracking
- **reviews** - Customer reviews and ratings

All tables have Row Level Security (RLS) enabled for data protection.

### Testing with Stripe Payment

To test payments with Stripe, use the following test card details:

- **Card Number**: 4242 4242 4242 4242
- **Expiry Date**: Any future date
- **CVC**: Any 3 digits
- **ZIP Code**: Any 5 digits

## Deployment

### Deployment Guide

**Backend Deployment (Render/Heroku/Railway):**
1. Create a new web service
2. Connect your repository
3. Set build command: `npm install --legacy-peer-deps --no-optional && npm run build`
4. Set start command: `npm run start:prod`
5. Add environment variables from `.env` file

**Frontend Deployment (Vercel/Netlify/Render):**
1. Create a new static site
2. Connect your repository
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Add environment variables:
   - `REACT_APP_API_URL`: Your backend URL
   - `REACT_APP_STRIPE_PUBLIC_KEY`: Your Stripe public key

**Database:**
- Already configured with Supabase PostgreSQL
- Connection details in backend `.env` file
- Migrations applied in `/supabase/migrations/`

### Environment Variables Checklist

**Backend (.env):**
- STRIPE_SECRET_KEY
- DATABASE_PASSWORD
- JWT_SECRET

**Frontend (.env.production):**
- REACT_APP_API_URL
- REACT_APP_STRIPE_PUBLIC_KEY

---
