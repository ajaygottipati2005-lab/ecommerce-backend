const express = require("express");

const router = express.Router();

const {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getProductsByCategory
} = require("../controllers/categoryController");

router.post("/create", createCategory);

router.get("/list", getCategories);

router.get("/:id/products", getProductsByCategory);

router.get("/:id", getCategoryById);

router.put("/:id", updateCategory);

router.delete("/:id", deleteCategory);

module.exports = router;