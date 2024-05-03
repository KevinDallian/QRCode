const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/api";

const API_ENDPOINTS = {
    products: `${API_BASE_URL}/products`,
    aggregations: `${API_BASE_URL}/aggregations`,
    jobs: `${API_BASE_URL}/jobs`,
    orders: `${API_BASE_URL}/orders`,
    masterboxs: `${API_BASE_URL}/masterboxs`
};

export default API_ENDPOINTS;