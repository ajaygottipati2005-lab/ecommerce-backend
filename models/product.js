const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },      

        price: {
            type: Number,
            required: true,
            min: 0.01
        },

        stock: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            required:true,
            enum: ['active', 'inactive'],
        },

        categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
        },
        image: {
    type: String,
    required: false
}
    },
    {
        timestamps: true
    }
);
 
const Product = mongoose.model("Product", productSchema);

module.exports = Product;