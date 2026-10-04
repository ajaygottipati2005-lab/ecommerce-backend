const Cart = require("../models/cart");
const User = require("../models/user");
const Product = require("../models/product");

// Add product to cart
const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // 1. Check required fields
        if (!userId || !productId || !quantity) {
            return res.status(400).json({
                message: "userId, productId and quantity are required"
            });
        }

        // 2. Quantity must be greater than 0
        if (quantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be greater than 0"
            });
        }

        // 3. Check whether user exists
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // 4. Check whether product exists
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // 5. Product must be active
        if (product.status !== "active") {
            return res.status(400).json({
                message: "Product is inactive and cannot be added to cart"
            });
        }

        // 6. Check available stock
        if (quantity > product.stock) {
            return res.status(400).json({
                message: `Only ${product.stock} items are available in stock`
            });
        }

        // 7. Check whether product already exists in user's cart
        const existingCartItem = await Cart.findOne({
            userId: userId,
            productId: productId
        });

        // 8. If already exists, increase quantity
        if (existingCartItem) {

            const newQuantity = existingCartItem.quantity + quantity;

            // Check stock again
            if (newQuantity > product.stock) {
                return res.status(400).json({
                    message: `Cannot add ${quantity} more. Only ${product.stock - existingCartItem.quantity} more items can be added`
                });
            }

            existingCartItem.quantity = newQuantity;
            existingCartItem.price = product.price;

            await existingCartItem.save();

            return res.status(200).json({
                message: "Cart quantity updated successfully",
                cartItem: existingCartItem
            });
        }

        // 9. Create new cart item
        const cartItem = new Cart({
            userId: userId,
            productId: productId,
            quantity: quantity,
            price: product.price
        });

        await cartItem.save();

        res.status(201).json({
            message: "Product added to cart successfully",
            cartItem: cartItem
        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding product to cart",
            error: error.message
        });
    }
};

// Get user's cart
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check whether user exists
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Get all cart items for the user
        const cartItems = await Cart.find({ userId })
            .populate("productId", "name price stock status");

        // Calculate item totals
        let grandTotal = 0;

        const cart = cartItems.map(item => {
            const itemTotal = item.quantity * item.price;

            grandTotal += itemTotal;

            return {
                _id: item._id,
                userId: item.userId,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                itemTotal: itemTotal
            };
        });

        res.status(200).json({
            message: "Cart fetched successfully",
            cart: cart,
            grandTotal: grandTotal
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching cart",
            error: error.message
        });
    }
};

// Update cart quantity
const updateCartQuantity = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        // Check quantity
        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be greater than 0"
            });
        }

        // Find cart item
        const cartItem = await Cart.findById(id);

        if (!cartItem) {
            return res.status(404).json({
                message: "Cart item not found"
            });
        }

        // Find product
        const product = await Product.findById(cartItem.productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Check product status
        if (product.status !== "active") {
            return res.status(400).json({
                message: "Product is inactive"
            });
        }

        // Check stock
        if (quantity > product.stock) {
            return res.status(400).json({
                message: `Only ${product.stock} items are available in stock`
            });
        }

        // Update quantity and current price
        cartItem.quantity = quantity;
        cartItem.price = product.price;

        await cartItem.save();

        res.status(200).json({
            message: "Cart quantity updated successfully",
            cartItem: cartItem
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating cart quantity",
            error: error.message
        });
    }
};

// Remove cart item
const removeCartItem = async (req, res) => {
    try {
        const { id } = req.params;

        // Find cart item
        const cartItem = await Cart.findById(id);

        if (!cartItem) {
            return res.status(404).json({
                message: "Cart item not found"
            });
        }

        // Delete cart item
        await Cart.findByIdAndDelete(id);

        res.status(200).json({
            message: "Cart item removed successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error removing cart item",
            error: error.message
        });
    }
};

// Clear user's cart
const clearCart = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check whether user exists
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Remove all cart items of the user
        const result = await Cart.deleteMany({ userId });

        res.status(200).json({
            message: "Cart cleared successfully",
            deletedItems: result.deletedCount
        });

    } catch (error) {
        res.status(500).json({
            message: "Error clearing cart",
            error: error.message
        });
    }
};

module.exports = {
    addToCart,
    getUserCart,
    updateCartQuantity, 
    removeCartItem,
    clearCart
};
