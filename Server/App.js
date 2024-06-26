// express-server/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5032;

app.use(express.json());
app.use(cors());

// MongoDB Connection
(async () => {
    try {
        console.log(process.env.DATABASE_URL)
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Mongoose is connected");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
})();

// Define counter schema and model
const counterSchema = new mongoose.Schema({
    count: { type: Number, default: 0 },
    mycount: { type: Number, default: 0 }
},{ collection: 'counters' });
const Counter = mongoose.model('Counter', counterSchema);

// Routes
app.get('/api/counter', async (req, res) => {
    console.log("Reached GET method")
    try {
        
        const counter = await Counter.findOne();
        console.log(counter);
        res.json(counter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});
app.post('/api/counter/increment/:variable', async (req, res) => {
    try {
        const { variable } = req.params;
        let counter = await Counter.findOne();
        if (!counter) {
            counter = new Counter();
        }
        // counter.count++;
        if (variable === 'mycount') {
            counter.mycount++;
          } else if (variable === 'count') {
            counter.count++;
          }
        await counter.save();
        res.json(counter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});
app.post('/api/counter/decrement/:variable', async (req, res) => {
    try {
        const { variable } = req.params;
        let counter = await Counter.findOne();
        if (!counter) {
            counter = new Counter();
        }
        // counter.count++;
        if (variable === 'mycount') {
            counter.mycount--;
          } else if (variable === 'count') {
            counter.count--;
          }
        await counter.save();
        res.json(counter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});
app.post('/api/counter/decrement', async (req, res) => {
    try {
        let counter = await Counter.findOne();
        if (!counter) {
            counter = new Counter();
        }
        counter.count--;
        await counter.save();
        res.json(counter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
