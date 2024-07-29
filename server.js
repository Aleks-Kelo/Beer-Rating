const express = require('express');
const bodyParser = require('body-parser');
const { beerSchema, ratingSchema } = require('./schema');
const validate = require('./validation');
const {
    connectDB,
    insertDocument,
    findExactDocuments,
    findMatchingDocuments,
    fetchAllDocuments,
    updateRating,
} = require('./db');

const app = express();
const port = 3000;

connectDB().catch(console.error);

app.use(bodyParser.json());

// List all beers
app.get('/beers', async (req, res) => {
    try {
        const results = await fetchAllDocuments();
        if (results.empty) {
            return res.status(404).json({ message: 'No beers found' });
        }
        res.status(200).send(results);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Search beers by name
app.get('/beers/:name', async (req, res) => {
    const { name } = req.params;

    try {
        const results = await findMatchingDocuments(name);
        res.json(results);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Add a new beer
app.post('/beers', validate(beerSchema), async (req, res) => {
    const { name, type, rating } = req.body;

    try {
        // Read data from db
        const results = await findExactDocuments(name);

        if (results.length !== 0) {
            return res.status(400).json({ message: 'Beer already exists' });
        }

        const newBeer = {
            name,
            type,
            rating: rating ? rating : 0,
            ratingCount: rating ? 1 : 0,
        };

        await insertDocument(newBeer);

        return res.status(201).json(newBeer);
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Update a beer's rating
app.put('/beers/:name', validate(ratingSchema), async (req, res) => {
    const { name } = req.params;

    try {
        const { rating } = req.body;

        // Read data from db
        const results = await findExactDocuments(name);

        if (results.length === 0) {
            return res.status(400).json({ message: 'Beer does not exists' });
        }

        const [beer] = results;

        // Calculate the new rating
        const newRating = beer.rating
            ? (beer.rating * beer.ratingCount + rating) / (beer.ratingCount + 1)
            : rating;

        // Round and format the new rating to 2 decimal places
        beer.rating = parseFloat(newRating.toFixed(2));

        beer.ratingCount += 1;

        await updateRating(beer);

        return res.status(200).json(beer);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
