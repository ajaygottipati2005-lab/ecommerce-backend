const Product = require("../models/product");
const Category = require("../models/category");

const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, status, categoryId, image } = req.body;

        if (!name || !description || price === undefined || stock === undefined || !status || !categoryId) {
            return res.status(400).json({
                success: false,
                message: "All product fields are required"
            });
        }

        if (price <= 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be greater than 0"
            });
        }

        if (stock < 0) {
            return res.status(400).json({
                success: false,
                message: "Stock cannot be negative"
            });
        }

        if (!["active", "inactive"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be active or inactive"
            });
        }

        // Check category exists
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // Check category is active
        if (category.status !== "active") {
            return res.status(400).json({
                success: false,
                message: "Cannot assign product to inactive category"
            });
        }

        const product = await Product.create({
            name,
            description,
            price,
            stock,
            status,
            categoryId,
            image
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create product",
            error: error.message
        });
    }
};


const getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch products",
            error: error.message
        });
    }
};


const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            product
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch product",
            error: error.message
        });
    }
};


const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const { name, description, price, stock, status, categoryId, image } = req.body;

        if (!name || !description || price === undefined || stock === undefined || !status || !categoryId) {
            return res.status(400).json({
                success: false,
                message: "All product fields are required"
            });
        }

        if (price <= 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be greater than 0"
            });
        }

        if (stock < 0) {
            return res.status(400).json({
                success: false,
                message: "Stock cannot be negative"
            });
        }

        if (!["active", "inactive"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be active or inactive"
            });
        }

        // Check category exists
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // Check category is active
        if (category.status !== "active") {
            return res.status(400).json({
                success: false,
                message: "Cannot assign product to inactive category"
            });
        }

        const product = await Product.findByIdAndUpdate(
            id,
            {
                name,
                description,
                price,
                stock,
                status,
                categoryId,
                image
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update product",
            error: error.message
        });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            product
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete product",
            error: error.message
        });
    }
};


module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};