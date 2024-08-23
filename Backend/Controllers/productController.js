const Product = require('../Models/productModel');

const addProduct = async (req,res) => {
    try{
        const {name , price,quantity} = req.body;
        const image = req.file.path;

        const newProduct = new Product({
            name,
            price,
            quantity,
            image
        });

        await newProduct.save();
        res.status(201).json({message:'Product added successfully',product:newProduct});

    }catch(error){
        res.status(500).json({message:'Server error',error});
    }
};

module.exports = {
    addProduct
};