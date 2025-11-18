// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config(); // Uses .env locally; on Render it will use Render env vars

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(__dirname));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => console.error('❌ MongoDB Error:', err.message));

// Car model
const carSchema = new mongoose.Schema({
  model: { type: String, required: true },
  type: { type: String, required: true },
  year: { type: Number, required: true },
  dailyRate: { type: Number, required: true },
  status: { type: String, required: true },
  description: { type: String, default: '' }
}, { timestamps: true });

const Car = mongoose.model('Car', carSchema);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AutoRent API running', timestamp: new Date().toISOString() });
});

// ===== API ROUTES (must match script.js) =====

// GET /api/cars - all cars
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/cars/available - only Available cars
app.get('/api/cars/available', async (req, res) => {
  try {
    const cars = await Car.find({ status: 'Available' }).sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/cars/:id - single car
app.get('/api/cars/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/cars - create car
app.post('/api/cars', async (req, res) => {
  try {
    const car = new Car(req.body);
    const savedCar = await car.save();
    res.status(201).json(savedCar);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/cars/:id - update car
app.put('/api/cars/:id', async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCar) return res.status(404).json({ error: 'Car not found' });
    res.json(updatedCar);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/cars/:id - delete car
app.delete('/api/cars/:id', async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    if (!deletedCar) return res.status(404).json({ error: 'Car not found' });
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== FRONTEND ROUTES =====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/cars.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'cars.html'));
});

app.get('/add-car.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'add-car.html'));
});

app.get('/edit-car.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'edit-car.html'));
});

// (Optional) Catch-all to fallback to homepage
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

app.listen(PORT, () => {
  console.log(`🚗 Server running on port ${PORT}`);
});
