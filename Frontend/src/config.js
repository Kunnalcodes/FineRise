// Central configuration for the API URL
// In production (on Render), we use the environment variable REACT_APP_API_URL
// In development, we fall back to localhost:4000
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default API_URL;
