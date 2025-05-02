const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from 'public'
app.use(express.static('public'));

// Load login.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route for welcome page
app.get('/welcome', (req, res) => {
  res.send(`
    <div style="text-align: center;">
      <h2>Welcome, suvetha!</h2>
      <p>You're successfully logged in.</p>
    </div>
  `);
});

// Handle POST request for login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validate credentials
  if (username === 'suvetha' && password === '1234') {
    // Redirect to welcome page on successful login
    res.redirect('/welcome');
  } else {
    // Display invalid credentials message
    res.send(`
      <div style="text-align: center;">        
        <p style="color: red;">Invalid credentials. Please try again.</p>
      </div>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
