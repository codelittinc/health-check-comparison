require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection URI from environment variable
const mongoURI = process.env.DATABASE_URI;

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('Error connecting to MongoDB:', err));

// Define a schema for the health-test collection
const healthSchema = new mongoose.Schema({
    name: String,
    up: Boolean,
});

// Create a model for the health-test collection
const HealthTest = mongoose.model('health-test', healthSchema);

// Define the /check endpoint
app.get('/health', async (req, res) => {
    try {
        let healthCheck = await HealthTest.findOne({ name: 'health-check' });
        if (!healthCheck) {
            healthCheck = new HealthTest({ name: 'health-check', up: true });
            await healthCheck.save();
            res.status(200).send('Service is up and document was created');
        } else if (healthCheck.up) {
            res.status(200).send('Service is up');
        } else {
            res.status(500).send('Service is down');
        }
    } catch (error) {
        res.status(500).send('Error checking health status');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
