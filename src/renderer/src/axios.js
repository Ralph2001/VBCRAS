import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: '', // Will be set dynamically before each request
    headers: {
        'Content-Type': 'application/json'
    },
});


axiosInstance.interceptors.request.use(config => {
    const host = localStorage.getItem('host');
    const token = localStorage.getItem('token');

    config.baseURL = `http://${host}:1216/`;
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    } else {
        delete config.headers['Authorization'];
    }

    return config;
}, error => Promise.reject(error));


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
