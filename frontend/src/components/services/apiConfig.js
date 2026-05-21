import axios from "axios";
// const BASE_URL = 'http://localhost:8000/api';
const BASE_URL = 'https://ecommerce-2hvv.onrender.com/api';

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
})

export default api