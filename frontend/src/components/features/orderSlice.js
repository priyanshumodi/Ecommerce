import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllOrdersApi, getMyOrdersApi, addOrderApi, deleteOrderApi } from "../services/apiService";
import { toast } from "react-toastify";


export const fetchAllOrders = createAsyncThunk(
    'order/fetchAllOrders',
    async (_, { rejectWithValue }) => {
        try {
            const orders = await getAllOrdersApi();
            // console.log(orders)
            return orders;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const fetchMyOrders = createAsyncThunk(
    'order/fetchMyOrders',
    async (_, { rejectWithValue }) => {
        try {
            const orders = await getMyOrdersApi();
            // console.log(orders)
            return orders;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const addOrder = createAsyncThunk(
    'order/addOrder',
    async (formData, { rejectWithValue }) => {
        try {
            const order = await addOrderApi(formData);
            console.log(order)
            return order;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const deleteOrder = createAsyncThunk(
    'order/deleteOrder',
    async (productId, { rejectWithValue }) => {
        try {
            const order = await deleteOrderApi(productId);
            // console.log(order)
            return order;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

const initialState = {
    orders: [
        {
            _id: 1,
            customerId: "123",
            productId: "456",
            quantity: 1,
            totalPrice: 5000,
            status: "PENDING"
        }
    ],
    myOrders: [
        {
            _id: 1,
            customerId: "123",
            productId: "456",
            quantity: 1,
            totalPrice: 5000,
            status: "PENDING"
        }
    ],
    isLoading: false,
    error: null,
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllOrders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload;
                state.myOrders = [{}];
                state.error = null;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchMyOrders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchMyOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.myOrders = action.payload;
                state.orders = [{}];
                state.error = null;
            })
            .addCase(fetchMyOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(addOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                toast.success(`${action.payload?.message}`)
            })
            .addCase(addOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(deleteOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                toast.success(`${action.payload?.message}`)
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
    }
})


export default orderSlice.reducer