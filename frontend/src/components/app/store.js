import { configureStore } from "@reduxjs/toolkit";
import productReducer from '../features/productSlice'
import userReducer from '../features/userSlice'
import orderReducer from '../features/orderSlice'
import  messageReducer  from "../features/messageSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        product: productReducer,
        order: orderReducer,
        message: messageReducer
    }
})