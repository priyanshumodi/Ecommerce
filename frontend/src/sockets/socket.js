import { io } from "socket.io-client";

const URL = "https://ecommerce-2hvv.onrender.com"; 

// autoConnect: false stops it from firing before user is authenticated
export const socket = io(URL, {
    autoConnect: false, 
    withCredentials: true // Crucial if you are passing HTTP-only cookies
});