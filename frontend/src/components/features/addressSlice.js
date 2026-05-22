import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addAddressApi } from "../services/apiService";

export const addAddress = createAsyncThunk(
    'address/addAddress',
    async (data, { rejectWithValue }) => {
        try {
            const address = await addAddressApi(data);
            // console.log(address)
            return address;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

const initialState = {
    address: [],
    isLoading: false,
    error: null,
}

export const addressSlice = createSlice({
    name: 'message',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(addAddress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.address = action.payload
                state.error = null;
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
    }
})

export default addressSlice.reducer