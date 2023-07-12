const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/weatherDb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Failed to connect to MongoDB:', error));

// Define the User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const City = mongoose.model('City', citySchema);

// API endpoint for user registration
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ email, password: hashedPassword, role });
    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during user registration:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// API endpoint for user login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, 'secretKey');

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error during user login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Middleware for JWT authentication
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Missing authorization token' });
  }

  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid authorization token' });
    }
    req.user = user;
    next();
  });
};

// API endpoint to fetch all cities
app.get('/api/cities', async (req, res) => {
    try {
      // Fetch all cities from the database
      const cities = await City.find({}, 'name');

      return res.status(200).json(cities);
    } catch (error) {
      console.error('Error fetching cities:', error);
      return res.status(500).json({ message: 'Failed to fetch cities' });
    }
  });

// API endpoint to add a city (admin only)
app.post('/api/cities',async (req, res) => {

    const { name } = req.body;

    try {
      // Check if the city already exists
      const existingCity = await City.findOne({ name });
      if (existingCity) {
        return res.status(409).json({ message: 'City already exists' });
      }

      // Create a new city
      const newCity = new City({ name });
      await newCity.save();

      return res.status(201).json({ message: 'City added successfully' });
    } catch (error) {
      console.error('Error adding city:', error);
      return res.status(500).json({ message: 'Failed to add city' });
    }
});

app.post("/test",(req,res)=>{
   const name=req.body.name;
   console.log(name);
})
// Start the server
app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});