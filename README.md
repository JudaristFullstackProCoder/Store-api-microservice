# Store API

## The goal of this project

The goal of this project is to create an api is to manage entities : store, product, category, child catehory, option, promo code.

## The front end of this version is hosted [here](https://store-api-front.vercel.app/)

## Tools and sofwares

1. [Visual studio code](https://code.visualstudio.com/)
2. [Nodejs](https://nodejs.org/) / [Express](http://expressjs.com/)
3. [Mongodb](https://www.mongodb.com/fr-fr) / [Mongoose](https://mongoosejs.com/)
4. [Docker](https://hub.docker.com/editions/community/docker-ce-desktop-windows/)
5. [MongoDb](https://www.mongodb.com/fr-fr) Server and MongoDB Compass (GUI)
6. [Git](https://git-scm.com/)
7. [Elesticsearch](https://www.elastic.co/fr/elasticsearch/) I want to use Elesticsearch to allow advanced product search, Elasticsearch is used there like a search engine

## For Testing

For testing this api i started using a vscode extension called [Thunder Client](https://www.thunderclient.com/), but i realise that this is not efficient.
Testing the Api with testing librairy may be more sufficient and more simple. For testing i use [chai-http](https://www.chaijs.com/plugins/chai-http/), [chai](https://www.chaijs.com/), and [mocha](https://mochajs.org/).

## About Elasticsearch

For product search to be possible, products must be stored in mongodb and Elasticsearch at the same time. However mongodb will be used as the main storage as Elasticsearch will be used only for research. It will be possible to search for products with very advanced criteria thanks to Elasticsearch. When a product is therefore created, an event will be triggered which will trigger the registration of the product in elasticsearch.
NB: Products stored in Elasticsearch will first be populated using mongoose's `populated` method.
NB: The products in Mongodb will therefore be updated, each time those are modified in mongodb.

### Product options

Product option allow us to add some additionals informations to a product depending on their category.
Products have common property (name, price ...) but in some case we want to add specific options (property)
to a product. These options depend on the category of the product : each category have specific options
and this options will be used by all product that have this category. Exemple : Given two category PC and Book; PC have specific option like RAM, CPU, HDD that Book doesn't have.

### Variable product

Allow us give a different price and image to a product depending on his specificity. For example a PC Core i7 with 8 GO RAM will cost less than a PC Core i7 with 32 GO RAM.
This product variability is inspired from woocommerce  take a look at this for more understanding [Woocommerce variable product](https://woocommerce.com/document/variable-product/).
the API will create this type of product from the several specificity (product options)

## Api endpoints

### Category

* `POST` /api/v1/category
* `GET`  /api/v1/category/:id
* `PATCH` /api/v1/category/:id
* `DELETE` /api/v1/category/:id

### Child Category

* `POST` /api/v1/category/childs
* `GET`  /api/v1/category/childs/:id
* `PATCH` /api/v1/category/childs/:id
* `DELETE` /api/v1/category/childs/:id
* `DELETE` /api/v1/category/childs/:id/options
* `POST` /api/v1/category/childs/:id/options

### Options

* `POST` /api/v1/options
* `GET`  /api/v1/options/:id
* `PATCH` /api/v1/options/:id
* `DELETE` /api/v1/options/:id

### Store

* `POST` /api/v1/store
* `GET`  /api/v1/store/:id
* `PATCH` /api/v1/store/:id
* `DELETE` /api/v1/store/:id

### Products

* `POST` /api/v1/products
* `GET`  /api/v1/products/:id
* `PATCH` /api/v1/products/:id
* `DELETE` /api/v1/products/:id
* `POST`   /api/v1/products/:id/options
* `DELETE`   /api/v1/products/:id/options

### Products variations

* `POST` /api/v1/product/:id/variation
* `GET`  /api/v1/product/:id/variation/:variationId
* `PATCH` /api/v1/product/:id/variation/:variationId
* `DELETE` /api/v1/product/:id/variation/:variationId
* `PUT` /api/v1/product/:id/variation/:variationId/image

### Promocodes

* `POST` /api/v1/promocodes
* `GET`  /api/v1/promocodes/:id
* `PATCH` /api/v1/promocodes/:id
* `DELETE` /api/v1/promocodes/:id

## Create an image to use the API as a microservice

* `cd` to project folder
* `run command` docker buil -t `image name` .
* docker run -v %cd%:/store-api -v /store-api/node_modules  -p `container            port`:`your pc port` --name `image name`     `image name`
* docker run -v %cd%:/store-api -v /store-api/node_modules --env PORT=value -p `container port`:`your pc port` --name `image name` `image name`

## With Docker Compose

* docker-compose -f docker-compose.yml -f docker-compose.dev.yml -d up (development env)
* docker-compose -f docker-compose.yml -f docker-compose.dev.prod -d up (production env)
* docker-compose down

## Local development

* install mongodb server
* install Elasticsearch
* Clone the repository
* npm install
* npm run dev
