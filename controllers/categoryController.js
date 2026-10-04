const Category = require("../models/category");
const Product = require("../models/product");

const createCategory = async (req, res) => {
    try {
        const { name, description, status } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Category status is required"
            });
        }

        if (!["active", "inactive"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be active or inactive"
            });
        }

        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Category already exists"
            });
        }

        const category = await Category.create({
            name,
            description,
            status
        });

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create category",
            error: error.message
        });
    }
};

const getCategories = async (req, res) => {
    try {
        const { status } = req.query;

        const filter = {};

        if (status) {
            filter.status = status;
        }

        const categories = await Category.find(filter);

        return res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            categories
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
            error: error.message
        });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            category
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch category",
            error: error.message
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, status } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Category status is required"
            });
        }

        if (!["active", "inactive"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be active or inactive"
            });
        }

        const duplicateCategory = await Category.findOne({
            name,
            _id: { $ne: id }
        });

        if (duplicateCategory) {
            return res.status(400).json({
                success: false,
                message: "Category name already exists"
            });
        }

        const category = await Category.findByIdAndUpdate(
            id,
            {
                name,
                description,
                status
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update category",
            error: error.message
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            category
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete category",
            error: error.message
        });
    }
};

const getProductsByCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        const products = await Product.find({ categoryId: id });

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch products by category",
            error: error.message
        });
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getProductsByCategory
};
