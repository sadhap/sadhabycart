const products = require("../data/product.json");
const Product = require('../models/productModel');
const dotenv = require('dotenv');
dotenv.config({path:'backend/config/config.env'});
const connectDatabase = require("../config/database")
connectDatabase();
const seeProducts = async ()=>{
    try {
        await Product.deleteMany();
        console.log('product deleted');
        await Product.insertMany(products);
        console.log('all products added');
        
    } catch (error) {
        console.log(error.message);
    }
    process.exit();//stoping the node programe
}
seeProducts();