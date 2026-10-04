const express = require("express");

const {
    addToCart,
    getUserCart,
    updateCartQuantity,
    removeCartItem,
    clearCart
} = require("../controllers/cartController");

const router = express.Router();

// Add product to cart
router.post("/add", addToCart);

// Clear user's cart
router.delete("/user/:userId", clearCart);

// Get user's cart
router.get("/:userId", getUserCart);

// Update cart quantity
router.put("/:id", updateCartQuantity);

// Remove cart item
router.delete("/:id", removeCartItem);

module.exports = router;