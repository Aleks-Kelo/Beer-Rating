db = db.getSiblingDB('test_db');

db.createCollection('beers');

db.beers.insertMany([
    {
        name: 'Ipa',
        type: 'Pale ale',
        rating: 4,
        ratingCount: 3,
    },
    {
        name: 'Heineken',
        type: 'Lager',
        rating: 3,
        ratingCount: 2,
    },
    {
        name: 'Budweiser',
        type: 'Lager',
        rating: 4,
        ratingCount: 6,
    },
    {
        name: 'Corona',
        type: 'Pale Lager',
        rating: 2,
        ratingCount: 1,
    },
]);
