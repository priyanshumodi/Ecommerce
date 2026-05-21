import { io } from "socket.io-client";

const URL = "http://localhost:8000"; 

// autoConnect: false stops it from firing before user is authenticated
export const socket = io(URL, {
    autoConnect: false, 
    withCredentials: true // Crucial if you are passing HTTP-only cookies
});