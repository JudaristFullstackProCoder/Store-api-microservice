# Store API

## The goal of this project

The goal of this project is to create an api is to manage entities : store, product, category, child catehory, option, promo code.

## Tools and sofwares

1. Vscode
2. Nodejs / Express
3. Mongodb / Mongoose
4. Docker

## Managing store

The api manage crud of store, each store have his properties (id, name, settings, shopkeeper) and settings

* name : string
* settings : object
* shopkeeper : id (The store user owner)

## Managing prouduct

The api manage crud of products, each product have (name, price, description, options, category, online, shopkeeper, store, images, pre_video, compositions)

* name: string
* price : int
* description : string
* options : object
* category : id
* online : bool
* shopkeeper (author) : id
* store : id
* image: object
* images : array of object
* pre_video: object
* compositions: array of object

### Product options

Product option allow us to add some additionals informations to a product depending on their category.
Products have common property (name, price ...) but in some case we want to add specific options (property)
to a product. These options depend on the category of the product : each category have specific options
and this options will be used by all product that have this category. Exemple : Given two category PC and Book; PC have specific option like RAM, CPU, HDD that Book doesn't have.

### Product images

Product's images allow to store additional images to a product.

### Variable product

Allow us give a different price and image to a product depending on his specificity. For example a PC Core i7 with 8 GO RAM will cost less than a PC Core i7 with 32 GO RAM.
This product variability is inspired from woocommerce  take a look at this for more understanding [Woocommerce variable product](https://woocommerce.com/document/variable-product/).
the API will create this type of product from the several specificity (product options)

### Product store and shopkeeper

`store` is where product is stored, and `shopkeper` the user who create this product.

### Product pre_video

Its the video that present the product (facultative).

## Managing category and child category

This api manage crud of category and child category

* category

    1. name : string

* child category

    1. name : string
    2. category : id
    3. category : id of the parent category

## Managing promocode crud

The api manage promo code crud

* name : string
* discount : int
* to  : int
* from : int
* remaininguse : int (remaining use)
* maxuse : int (max nomber of use)

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

### Promocodes

* `POST` /api/v1/promocodes
* `GET`  /api/v1/promocodes/:id
* `PATCH` /api/v1/promocodes/:id
* `DELETE` /api/v1/promocodes/:id

### Product's files upload
#### When you upload a featured image for a product, the API will create a folder that corresponds to the product id and it is in this folder that all the files for this product will be saved.

* `POST` /api/v1/upload/product/:id/image (add or replace featured image)
* `DELETE` /api/v1/upload/product/:id/image (delete featured image)
* `POST` /api/v1/upload/product/:id/video (add or replace featured video)
* `DELETE` /api/v1/upload/product/:id/video (delete featured video)
* `POST` /api/v1/upload/product/:id/images (add more images)
* `POST` /api/v1/upload/product/:id/images/:name (delete an image in the additional images)

## Local development

* Clone the repository
* npm install
* npm run dev

made by `Judarist Fullstack  - judearist@gmail.com`
