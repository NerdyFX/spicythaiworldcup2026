require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/worldcup';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Registration Schema
const registrationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, default: 'N/A' },
    amount: { type: Number, required: true },
    team: { type: String, required: true },
    eligible: { type: Boolean, required: true },
    date: { type: Date, default: Date.now }
});

const Registration = mongoose.model('Registration', registrationSchema);

// API Endpoints
app.get('/api/registrations', async (req, res) => {
    try {
        const data = await Registration.find().sort({ date: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const { name, phone, amount, team } = req.body;
        
        if (!name || !amount || !team) {
            return res.status(400).json({ error: 'Name, Amount, and Team are required' });
        }

        const newRegistration = new Registration({
            name,
            phone: phone || 'N/A',
            amount: parseFloat(amount),
            team,
            eligible: parseFloat(amount) >= 1500
        });

        await newRegistration.save();
        res.status(201).json(newRegistration);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Serve static frontend in production
if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
