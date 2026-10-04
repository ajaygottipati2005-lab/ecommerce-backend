const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },

        description: {
            type: String
        },

        status: {
            type: String,
            required: true,
            enum: ["active", "inactive"]
        }
    },
    {
        timestamps: true
    }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;