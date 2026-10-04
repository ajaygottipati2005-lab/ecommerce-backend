const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const mutualFundRoutes = require("./routes/mutualFundRoutes");
const cors = require("cors");

dotEnv.config();

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use("/category", categoryRoutes);
app.use("/api/mutual-funds", mutualFundRoutes);
app.use("/product", productRoutes);
app.use("/user", userRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error);
    });

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});