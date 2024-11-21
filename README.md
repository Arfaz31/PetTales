# PETTALES Backend

The **PETTALES** backend is a RESTful API that powers the PETTALES platform, providing endpoints for user authentication, post management, comments, likes, and premium content. It uses Node.js, Express.js, and MongoDB for a scalable and secure backend architecture.

## Live Demo

Explore the PETTALES platform backend live: [PETTALES Backend Live Demo](https://pet-tales-server-side.vercel.app/)

---

## Features

### User Management

- **User Registration:** Create new user accounts with validation.
- **Login & Logout:** Secure JWT-based authentication.
- **Change Password:** Update user passwords securely.
- **Reset Password:** Request and reset user passwords via email.
- **User Profiles:** Fetch and update user profile information.
- **Role Management:** Supports admin and regular user roles.

### Post Management

- **Post Creation:** Add new posts with or without images.
- **Premium Content:** Restrict access to premium posts for unpaid users.
- **Post Editing:** Update post details.
- **Post Deletion:** Delete posts with validation (only for owners or admins).
- **Like/Dislike System:** Add or remove likes and dislikes for posts.
- **Premium Posts:** Allow only premium users to create premium posts.

### Comment System

- **Create Comments:** Add comments to posts.
- **Edit/Delete Comments:** Modify or remove comments based on ownership or admin rights.
- **Nested Replies:** Enable threaded discussions.

### Follow System

- **Follow Users:** Follow and unfollow other users.
- **Following List:** Fetch a list of users being followed by the current user.
- **Follower List:** Fetch a list of users following the current user.

### Premium Content

- **Payment Integration:** Unlock premium posts using **Aamarpay** or **Stripe**.
- **Access Control:** Ensure only paid users can access premium content.
- **Unlock Status:** Track which users have access to specific premium posts.
- **Upgrade Status:** Allow basic users to upgrade their account to premium by purchasing a subscription.

---

## Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Payment Gateways:** Aamarpay
- **Validation:** Zod for request validation
- **Environment Variables:** dotenv for managing environment configurations
- **Deployment:** Vercel
- **Image Upload:** Cloudinary

---

## Setup and Installation

### Prerequisites

Ensure you have the following installed on your system:

- Node.js (v16 or later)
- npm or yarn
- MongoDB

### Steps to Run Locally

## Installation:

- **Clone the repository:** open cmd and type git clone (github repo link here)
- **Install dependencies:** using npm install.
- **create .env file at root dir:** .env
- **Run the server:** using npm run dev.

## Configuration:

- **NODE_ENV=** development
- **PORT=** Port number the server listens on. Default: 5000
- **DATABASE_URL=** URI for MongoDB database.
- **Run the server:** using npm run dev.

### Set up environment variables

Create a `.env.local` file in the root directory and add the following:

```plaintext
NODE_ENV=development
PORT=5000
DATABASE_URL=<your-mongodb-connection-string>
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=<your-jwt-access-secret>
JWT_REFRESH_SECRET=<your-jwt-refresh-secret>
JWT_ACCESS_EXPIRES_IN=90d
JWT_REFRESH_EXPIRES_IN=365d
RESET_PASS_UI_LINK=https://pettales.vercel.app/reset-password
CLOUD_NAME=<your-cloudinary-cloud-name>
API_KEY=<your-cloudinary-api-key>
API_SECRET=<your-cloudinary-api-secret>
STORE_ID=<your-aamarpay-store-id>
SIGNATURE_KEY=<your-aamarpay-signature-key>
PAYMENT_URL=https://sandbox.aamarpay.com/jsonpost.php
PAYMENT_VERIFY_URL=https://sandbox.aamarpay.com/api/v1/trxcheck/request.php

```
