const Order = require("../models/order");
const Cart = require("../models/cart");
const User = require("../models/user");
const Product = require("../models/product");

// Create order from cart
const createOrder = async (req, res) => {
    try {
        const { userId, shippingAddress } = req.body;

        if (!userId || !shippingAddress) {
            return res.status(400).json({
                message: "userId and shippingAddress are required"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const cartItems = await Cart.find({ userId });

        if (cartItems.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        for (const item of cartItems) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            if (product.status !== "active") {
                return res.status(400).json({
                    message: `Product ${product.name} is inactive`
                });
            }

            if (item.quantity > product.stock) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}`
                });
            }
        }

        const orderItems = [];
        let totalAmount = 0;

        for (const item of cartItems) {
            const product = await Product.findById(item.productId);

            const itemTotal = item.quantity * product.price;

            orderItems.push({
                productId: product._id,
                name: product.name,
                quantity: item.quantity,
                price: product.price,
                total: itemTotal
            });

            totalAmount += itemTotal;
        }

        const order = new Order({
            userId: userId,
            items: orderItems,
            totalAmount: totalAmount,
            status: "pending",
            shippingAddress: shippingAddress
        });

        await order.save();

        for (const item of cartItems) {
            await Product.findByIdAndUpdate(
                item.productId,
                {
                    $inc: { stock: -item.quantity }
                }
            );
        }

        await Cart.deleteMany({ userId });

        return res.status(201).json({
            message: "Order created successfully",
            order: order
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error creating order",
            error: error.message
        });
    }
};

// Get all orders of a user
const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const orders = await Order.find({ userId });

        return res.status(200).json({
            message: "Orders fetched successfully",
            orders: orders
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error fetching orders",
            error: error.message
        });
    }
};

// Get all orders - Admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });

        return res.status(200).json({
            message: "All orders fetched successfully",
            orders: orders
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error fetching all orders",
            error: error.message
        });
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        return res.status(200).json({
            message: "Order fetched successfully",
            order: order
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error fetching order",
            error: error.message
        });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "confirmed",
            "shipped",
            "delivered",
            "cancelled"
        ];

        if (!status) {
            return res.status(400).json({
                message: "Status is required"
            });
        }

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        order.status = status;

        await order.save();

        return res.status(200).json({
            message: "Order status updated successfully",
            order: order
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error updating order status",
            error: error.message
        });
    }
};

// Cancel order
const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (
            order.status !== "pending" &&
            order.status !== "confirmed"
        ) {
            return res.status(400).json({
                message: "Only pending or confirmed orders can be cancelled"
            });
        }

        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.productId,
                {
                    $inc: { stock: item.quantity }
                }
            );
        }

        order.status = "cancelled";

        await order.save();

        return res.status(200).json({
            message: "Order cancelled successfully",
            order: order
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error cancelling order",
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder
};