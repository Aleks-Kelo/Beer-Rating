# Steps to run the app

-   npm i
-   npm run start-db //optional for local db if you have docker
-   npm run start

# To list all the beers

GET localhost:3000/beers

# To search beers by name

GET localhost:3000/beers/:beerName

# To insert a new beer

POST localhost:3000/beers
{
name: string,
type: string,
rating?: number
}

# To update a beer's rating

PUT localhost:3000/beers/:beerName
{
rating: number
}
