// Initializes
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

// Load and expand environment variables
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

// Express app
const app = express();

// Port
const PORT = process.env.PORT || 4000;

// Routes
const productRoute = require('./routes/product');
const homeRoute = require('./routes/home');
const cartRoute = require('./routes/cart');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View engine setup (if needed)
app.set('view engine', 'ejs');
app.set('views', 'views');
app.disable('view cache');

// API Routes
app.use('/', homeRoute);
app.use('/products', productRoute);
app.use('/carts', cartRoute);
app.use('/users', userRoute);
app.use('/auth', authRoute);

// // Add this middleware right after your other middleware (after express.json())
// app.use((req, res, next) => {
//   const startTime = Date.now(); // Track request duration

//   // Log the incoming request
//   console.log('\n=== NEW REQUEST ===');
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//   console.log('Headers:', req.headers);
//   console.log('Body:', req.body); // Requires express.json() middleware

//   // Capture the original response function
//   const originalSend = res.send;
//   res.send = function (body) {
//     const responseTime = Date.now() - startTime;
//     console.log(`[Response] Status: ${res.statusCode} | Time: ${responseTime}ms`);
//     console.log('Response Body:', body); // Log response data (careful with sensitive info)
//     originalSend.call(this, body); // Call the original response function
//   };

//   next(); // Proceed to the next middleware/route
// });

// Mongoose connection
mongoose
  .connect("mongodb+srv://dhananjayaaps:XmTbVMW9sHnoP9JV@cluster0.h2qns8o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

module.exports = app;
