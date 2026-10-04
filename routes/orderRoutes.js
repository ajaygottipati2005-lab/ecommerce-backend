const express = require("express");
const router = express.Router();

const {
    createOrder,
    getUserOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder
} = require("../controllers/orderController");

const {
    authMiddleware,
    adminMiddleware
} = require("../middleware/authMiddleware");


router.post("/create", createOrder);

router.get("/user/:userId", getUserOrders);


// ADMIN ROUTES

router.get(
    "/all",
    authMiddleware,
    adminMiddleware,
    getAllOrders
);

router.get(
    "/:id",
    authMiddleware,
    adminMiddleware,
    getOrderById
);

router.put(
    "/:id/status",
    authMiddleware,
    adminMiddleware,
    updateOrderStatus
);


router.put("/\:id/cancel", cancelOrder);


module.exports = router;