const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/personalDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Define Person Schema
const personSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z\s]+$/.test(v); // Only letters and spaces allowed
      },
      message: props => `${props.value} contains numbers or special characters - only letters allowed in name`
    }
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  age: { 
    type: Number, 
    min: 0,
    max: 120 
  },
  phone: { 
    type: String,
    validate: {
      validator: function(v) {
        return /^\d*$/.test(v); // Only digits allowed
      },
      message: props => `${props.value} contains letters - only numbers allowed in phone`
    }
  },
  address: String
});

const Person = mongoose.model('Person', personSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

// Custom middleware for duplicate name check
const checkDuplicateName = async (req, res, next) => {
  try {
    const existingPerson = await Person.findOne({ name: req.body.name });
    if (existingPerson && (!req.params.id || existingPerson._id.toString() !== req.params.id)) {
      return res.status(400).send('Name already exists in database');
    }
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Routes
// Create
app.post('/api/persons', checkDuplicateName, async (req, res) => {
  try {
    const person = new Person(req.body);
    await person.save();
    res.status(201).send(person);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send(err.message);
    }
    res.status(400).send(err.message);
  }
});

// Read all
app.get('/api/persons', async (req, res) => {
  try {
    const persons = await Person.find();
    res.send(persons);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Read one
app.get('/api/persons/:id', async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) return res.status(404).send('Person not found');
    res.send(person);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update
app.put('/api/persons/:id', checkDuplicateName, async (req, res) => {
  try {
    const person = await Person.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!person) return res.status(404).send('Person not found');
    res.send(person);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send(err.message);
    }
    res.status(400).send(err.message);
  }
});

// Delete
app.delete('/api/persons/:id', async (req, res) => {
  try {
    const person = await Person.findByIdAndDelete(req.params.id);
    if (!person) return res.status(404).send('Person not found');
    res.send(person);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Serve HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));