const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://swapnilcp019:IICPZwz0Yz5u0YFv@cluster0.mgieh07.mongodb.net/bannerDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error(err));

// Mongoose schema and model
const bannerSchema = new mongoose.Schema({
    bannerVisible: { type: Boolean, required: true },
    description: { type: String, required: true },
    timer: { type: Number, required: true },
    link: { type: String, required: true }
});

const Banner = mongoose.model('Banner', bannerSchema);

// Fetch all banners
app.get('/api/banners', async (req, res) => {
    try {
        const banners = await Banner.find();
        res.json(banners);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add new banner
app.post('/api/banners', async (req, res) => {
    const { bannerVisible, description, timer, link } = req.body;
    const newBanner = new Banner({ bannerVisible, description, timer, link });

    try {
        const savedBanner = await newBanner.save();
        res.status(201).json(savedBanner);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update banner visibility
app.put('/api/banners/:id', async (req, res) => {
    const { id } = req.params;
    const { bannerVisible } = req.body;

    try {
        const updatedBanner = await Banner.findByIdAndUpdate(
            id,
            { bannerVisible },
            { new: true }
        );
        res.json(updatedBanner);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a banner
app.delete('/api/banners/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Banner.findByIdAndDelete(id);
        res.json({ message: 'Banner deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
