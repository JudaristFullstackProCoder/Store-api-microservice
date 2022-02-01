# Store API

## The goal of this project

The goal of this project is to create an api is to manage entities : store, product, category, child catehory, option, promo code.

## Tools and sofwares

1. Vscode
2. Nodejs / Express
3. Mongodb / Mongoose

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
* image : array of object
* pre_video: object
* compositions: array of object

### Product options

Product option allow us to add some additionals informations to a product depending on their category.
Products have common property (name, price ...) but in some case we want to add specific options (property)
to a product. These options depend on the category of the product : each category have specific options
and this options will be used by all product that have this category. Exemple : Given two category PC and Book; PC have specific option like RAM, CPU, HDD that Book doesn't have.

### Product images

Product's images allow to store additional images to a product.

### Product compositions

Allow us give a different price to a product depending on his specificity. For example a PC Core i7 with 8 GO RAM will cost less than a PC Core i7 with 32 GO RAM.

### Product store and shopkeeper

Its the store from where this product was created, and the person who create this product.

### Product pre_video

Its the video that present the product (facultative).

## Managing category and child category

This api manage crud of category and child category

* category

    1. name : string

* child category

    1. name : string
    2. category : id

## Managing promocode crud

The api manage promo code crud

* name : string
* discount : int
* to  : int
* from : int
* remaininguse : int (remaining use)
* maxuse : int (max nomber of use)

## Local development

* Clone the repository
* npm install
* npm run dev

made by `Judarist Fullstack  - judearist@gmail.com`
