const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory database (replace with real database in production)
let users = [];

// API Routes
app.post('/api/auth/signup', (req, res) => {
  const { fullName, email, phone, password } = req.body;
  
  // Check if user already exists
  if (users.some(user => user.email === email)) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  
  // Create new user
  const newUser = {
    id: Date.now().toString(),
    fullName,
    email,
    phone,
    password,
    expenses: [],
    budgets: []
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json(user);
  } else {
    res.status(401).json({ error: 'Invalid email or password' });
  }
});

// Serve Angular app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist/travel-budget-planner')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/travel-budget-planner/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});