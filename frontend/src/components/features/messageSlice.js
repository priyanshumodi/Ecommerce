import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUsersMessageApi } from "../services/apiService";

export const fetchUsersMessages = createAsyncThunk(
    'message/fetchUsersMessages',
    async (_id, { rejectWithValue }) => {
        try {
            const orders = await getUsersMessageApi(_id);
            // console.log(orders)
            return orders;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

const initialState = {
    messages: [
        {
            _id: 1,
            receiver: {
                _id: 2,
                firstName: "priyanshu",
                lastName: "modi",
                email: "priyashu@gmail.com",
            },
            text: ""
        }
    ],
    isLoading: false,
    error: null,
}

export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        setMessage: (state, action) => {
            state.messages = action.payload
        },
        addLocalMessage: (state, action) => {
            console.log(action.payload)
            state.messages.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsersMessages.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUsersMessages.fulfilled, (state, action) => {
                state.isLoading = false;
                state.messages = action.payload
                state.error = null;
            })
            .addCase(fetchUsersMessages.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
    }
})

export const { setMessage, addLocalMessage } = messageSlice.actions;

export default messageSlice.reducer