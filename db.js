const { MongoClient, ServerApiVersion } = require('mongodb');
// for testing only
// to move to .env
const cloud_uri =
    'mongodb+srv://keloaleksandro:tGheSneUPVWxo9kB@cluster0.6bmjvyt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const local_uri = 'mongodb://127.0.0.1:27017';

const dbName = 'test_db';
const collectionName = 'beers';

let client;
let beerCollection;

async function connectDB() {
    if (client) return; // Prevent multiple connections

    // try to connect to local db (docker)
    try {
        client = new MongoClient(local_uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });

        const db = client.db(dbName);

        beerCollection = db.collection(collectionName);

        await client.connect();

        console.log('Connected to local MongoDB successfully!');
    } catch (err) {
        console.log('Error connecting to local MongoDB:', err);

        // try to connect to cloud db in case local db fails
        try {
            client = new MongoClient(cloud_uri, {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                },
            });
            const db = client.db(dbName);
            beerCollection = db.collection(collectionName);

            await client.connect();
            console.log('Connected to cloud MongoDB successfully!');
        } catch (err) {
            console.error('Error connecting to cloud MongoDB:', err);
            throw err;
        }
    }
}

async function insertDocument(document) {
    return await beerCollection.insertOne(document);
}

async function findExactDocuments(beerName) {
    const query = { name: { $regex: `^${beerName.trim()}$`, $options: 'i' } };
    return await beerCollection.find(query).toArray();
}

async function findMatchingDocuments(beerName) {
    const query = { name: { $regex: beerName.trim(), $options: 'i' } };
    return await beerCollection.find(query).toArray();
}

async function updateRating(beer) {
    return await beerCollection.updateOne(
        { name: { $regex: `^${beer.name.trim()}$`, $options: 'i' } },
        { $set: { rating: beer.rating, ratingCount: beer.ratingCount } }
    );
}

async function fetchAllDocuments() {
    return await beerCollection.find({}).toArray();
}

process.on('exit', async () => {
    if (client) {
        await client.close();
    }
});

module.exports = {
    connectDB,
    insertDocument,
    findExactDocuments,
    findMatchingDocuments,
    updateRating,
    fetchAllDocuments,
};
