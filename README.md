🛒 GreenCart – Grocery E-Commerce Backend

GreenCart is a Node.js + Express.js backend for a grocery e-commerce platform. It provides secure APIs for user authentication, seller management, product listings, shopping carts, and orders.

🚀 Features

User and Seller authentication (JWT + OAuth 2.0 support)

Role-based authorization (user vs. seller access)

Product management (add, update, delete, view)

Shopping cart with add/remove items

Order creation and tracking

Image upload support with Multer + Cloudinary

Secure deployment setup (tested on Vercel)

🛠 Tech Stack

Node.js + Express.js – Backend framework

MongoDB – Database

JWT + OAuth 2.0 – Authentication

Multer + Cloudinary – File upload and storage

Vercel – Deployment

⚙️ Installation & Setup

Clone the repository:

git clone https://github.com/yourusername/GreenCart-Backend.git
cd GreenCart-Backend/server


Install dependencies:

npm install


Create a .env file in the server/ directory and add the following:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret


Start the server:

npm start


The backend will run on:

http://localhost:5000

📂 Project Structure
server/
├── configs/         # DB, multer, cloudinary configs
├── controllers/     # Request handlers
├── middlewares/     # Auth and role-based access
├── models/          # Mongoose schemas
├── routes/          # API routes
├── server.js        # App entry point
└── vercel.json      # Deployment config

🔐 Security Aspects

Passwords are hashed with bcrypt before storing.

JWT tokens used for session handling.

OAuth 2.0 integration for social logins (e.g., Google).

Middleware checks for role-based access.

Environment variables used for secrets and credentials.

📖 API Endpoints (Examples)
Authentication

POST /auth/register – Register user/seller

POST /auth/login – Login with email & password

GET /auth/google – Google OAuth login

GET /auth/google/callback – OAuth callback

Products

GET /products – Get all products

POST /products – Add new product (seller only)

Cart

POST /cart/add – Add item to cart (user only)

DELETE /cart/remove/:id – Remove item from cart

Orders

POST /orders – Create order (user only)

GET /orders – View orders

📦 Deployment

Hosted on Vercel.

To deploy:

Push your repo to GitHub.

Connect repo to Vercel.

Add environment variables in Vercel Dashboard.

Deploy 🎉
