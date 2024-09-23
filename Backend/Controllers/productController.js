const Product = require('../Models/productModel');
const fs = require('fs');
const path = require('path');

const addProduct = async (req,res) => {
    try{
        const {name , price,quantity} = req.body;
        const imagePath = `/uploads/${req.file.filename}`;

        const newProduct = new Product({
            name,
            price,
            quantity,
            image : imagePath,
        });

        await newProduct.save();
        res.status(201).json({message:'Product added successfully',product:newProduct});

    }catch(error){
        res.status(500).json({message:'Server error',error});
    }
};


const getAllProducts = async (req,res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const skip = (page-1) * limit;
        const products = await Product.find().skip(skip).limit(limit);
        const totalProducts = await Product.countDocuments();
        const totalPages = Math.ceil(totalProducts/limit);
        res.status(200).json({
            products,
            currentPage:page,
            totalPages,
            totalProducts,
        });
    }catch(error){
        console.error("Error retrieving products " , error);
        res.status(500).json({message:'Server error'});
    }
};

const deleteProduct = async (req,res) => {
    try{
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({message:'Product not found'});
        }

        const imagePath = path.join(__dirname,'..',product.image);
        if(fs.existsSync(imagePath)){
            fs.unlinkSync(imagePath);
        }

        await product.deleteOne();
        res.status(200).json({message:'Product deleted successfully'});
    }catch(error){
        console.error('Error deleting product ',error);
        res.status(500).json({message:'Server error',error});
    }
};

const updateProduct = async (req,res) => {
    try{
        const productId = req.params.id;
        const {name , price , quantity} = req.body;

        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({message:'Product not found'});
        }

        if(req.file){
            const imagePath = path.join(__dirname,'..',product.image);
            if(fs.existsSync(imagePath)){
                fs.unlinkSync(imagePath);
            }
            product.image = `/uploads/${req.file.filename}`;
        }

        product.name = name || product.name;
        product.price = price || product.price;
        product.quantity = quantity || product.quantity;

        await product.save();
        res.status(200).json({message:'Product updated successfully',product});
    }catch(error){
        console.error('Error updating product ',error);
        res.status(500).json({message:'Server error',error})
    }
}

module.exports = {
    addProduct,
    getAllProducts,
    deleteProduct,
    updateProduct,
};