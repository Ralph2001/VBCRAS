import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `http://${localStorage.getItem('host')}:1216/`,
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json' 
    },
});

// A reusable function to make requests
const makeRequest = async (method, endpoint, data = null) => {
    try {
        const response = await axiosInstance({
            method,
            url: endpoint,
            data,
        });
        return response.data;
    } catch (error) {
        console.error(`Error with ${method} request to ${endpoint}:`, error);
        throw error;
    }
};

export default makeRequest;
