import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllProductApi, deleteProductApi } from "../services/apiService";
import { toast } from "react-toastify";


export const fetchAllProducts = createAsyncThunk(
    'product/fetchAllProducts',
    async (_, { rejectWithValue }) => {
        try {
            const products = await getAllProductApi();
            return products;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const  deleteProduct = createAsyncThunk(
    'product/deleteProduct',
    async (productId, { rejectWithValue }) => {
        try {
            const product = await deleteProductApi(productId);
            console.log(product)
            // return product;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

const initialState = {
    products: [
        {
            _id: 1,
            name: "product",
            description: "good product",
            price: 50000,
            image: "",
            quantity: 4,
            category: "mobile"
        }
    ],
    isLoading: false,
    error: null,
}

export const productSlice = createSlice({
    name: 'product',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload;
                state.error = null;
            })
            .addCase(fetchAllProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(deleteProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;

                toast.success(`${action.payload?.message}`)
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
    }
})


export default productSlice.reducer