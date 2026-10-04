const { searchMutualFunds } = require("../services/mfapiService");

const searchMutualFundsController = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                message: "Search keyword is required"
            });
        }

        const data = await searchMutualFunds(q);

        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({
            message: "Error fetching mutual fund search results",
            error: error.message
        });
    }
};

module.exports = {
    searchMutualFundsController
};