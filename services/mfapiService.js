const axios = require("axios");

const MFAPI_BASE_URL = "https://api.mfapi.in";

// Search mutual funds
const searchMutualFunds = async (query) => {
    const response = await axios.get(
        `${MFAPI_BASE_URL}/mf/search`,
        {
            params: {
                q: query
            }
        }
    );

    return response.data;
};

// Get mutual fund scheme details
const getSchemeDetails = async (schemeCode) => {
    const response = await axios.get(
        `${MFAPI_BASE_URL}/mf/${schemeCode}`
    );

    return response.data;
};

// Get latest NAV
const getLatestNAV = async (schemeCode) => {
    const response = await axios.get(
        `${MFAPI_BASE_URL}/mf/${schemeCode}/latest`
    );

    return response.data;
};

// Get NAV history
const getNAVHistory = async (schemeCode) => {
    const response = await axios.get(
        `${MFAPI_BASE_URL}/mf/${schemeCode}`
    );

    return response.data;
};

module.exports = {
    searchMutualFunds,
    getSchemeDetails,
    getLatestNAV,
    getNAVHistory
};