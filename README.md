
# 🛍️ MERN Stack eCommerce Website

An eCommerce platform built with the MERN (MongoDB, Express.js, React.js, Node.js) stack. This project is designed to provide a full-stack implementation of an online shopping application with features like product listing, user authentication, shopping cart, order management, and payment handling.

---

## ✨ Features

- 🔐 **User Authentication**: Register, login, and manage accounts with JWT-based authentication.
- 🛒 **Product Management**: Browse, search, filter, and view details of products.
- 🛍️ **Shopping Cart**: Add, edit, and remove items from the cart.
- 📦 **Order Management**: Place and view orders.
- ⚙️ **Admin Dashboard**: Manage users, products, and orders (CRUD operations).
- 💳 **Payment Integration**: Secure online payments using **Stripe**.
- 📱 **Responsive Design**: Optimized for both desktop and mobile devices.
- 🔄 **Session Persistence**: Uses **Upstash Redis** for storing refresh tokens to handle session persistence.
- 💬 **Animated Transitions**: Smooth user interface animations with **Framer Motion**.

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ **React.js** with functional components and hooks
- 🛤️ **React Router** for navigation
- 🌐 **Axios** for API requests
- 🎨 **CSS/Tailwind** for styling
- 🎞️ **Framer Motion** for smooth animations and transitions
- 🏦 **Stripe** for payment processing
- 🛍️ **Zustand** for global state management
- 🔔 **React Hot Toast** for notifications and alerts
- 🎉 **React Confetti** for celebratory animations
- 📊 **Recharts** for data visualization (Admin dashboard)

### Backend
- 🟢 **Node.js** with **Express.js**
- 📂 **MongoDB (Atlas)** as the database
- 🔗 **Mongoose** for interacting with MongoDB using schema-based models
- 🔑 **JWT** for authentication and authorization (access & refresh tokens)
- 🔒 **Bcryptjs** for password hashing
- 🍪 **Cookie-parser** for reading and managing HTTP-only cookies
- 🛢️ **Upstash Redis** for session management and storing refresh tokens
- 🌩️ **Cloudinary** for storing product images and media
- 💳 **Stripe** for payment processing
- 🧰 **Nodemon** for auto-restarting the server in development

---

## ⚙️ Installation and Setup

### 📋 Prerequisites
- 🖥️ [Node.js](https://nodejs.org/) installed on your system
- 🛢️ MongoDB installed or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- 💳 A Stripe account for payment integration

### 🏗️ Steps to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/krjofficial/mern-ecomm.git
   cd mern-ecommerce
   ```

2. Install dependencies:
   - For the backend:
     ```bash
     cd backend
     npm install
     ```
   - For the frontend:
     ```bash
     cd frontend
     npm install
     ```

3. Configure environment variables:
   - Create a `.env` file in the `backend` directory and add the following:
     ```
     PORT=5000
     MONGO_URI=your-mongodb-connection-string
     JWT_SECRET=your-jwt-secret
     STRIPE_API_KEY=your-stripe-api-key
     COOKIE_SECRET=your-cookie-secret
     REDIS_URL=your-redis-url
     CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
     CLOUDINARY_API_KEY=your-cloudinary-api-key
     CLOUDINARY_API_SECRET=your-cloudinary-api-secret
     ```

4. Start the development servers:
   - Backend:
     ```bash
     cd backend
     npm run dev
     ```
   - Frontend:
     ```bash
     cd frontend
     npm run dev
     ```

5. Visit the application:
   - 🌐 Frontend: `http://localhost:5173`
   - 🛠️ Backend API: `http://localhost:5000`

---

## 🗂️ Folder Structure

### Frontend
```
frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/ 
│   ├── App.js
│   └── index.js
```

### Backend
```
backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── server.js
└── .env
```

---

## 🛤️ Roadmap

- ⭐ Implement product reviews and ratings
- 📄 Add pagination for product listings
- 🔍 Integrate advanced search and filter features
- 📧 Add email notifications for order updates
- 💳 Expand payment options (Stripe/PayPal)
- 🔒 Enhance security features (e.g., OAuth, two-factor authentication)
- 🌎 Improve multi-language and multi-currency support

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the project.
2. Create your feature branch:
   ```bash
   git checkout -b feature/YourFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/YourFeature
   ```
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgements

- [MERN Stack Documentation](https://www.mongodb.com/mern-stack)
- [React.js Documentation](https://reactjs.org/)
- [Node.js Documentation](https://nodejs.org/)
- [Express.js Documentation](https://expressjs.com/)
- [Stripe API Documentation](https://stripe.com/docs)
- [Upstash Redis](https://upstash.com/)
- [Cloudinary](https://cloudinary.com/)
- [Framer Motion](https://www.framer.com/motion/)
