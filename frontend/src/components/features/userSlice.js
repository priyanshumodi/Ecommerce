import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUserApi } from "../services/apiService";
import { logoutUserApi } from "../services/apiService";
import { getAllUsersApi } from "../services/apiService";
import { getUsersChatsApi } from "../services/apiService"
import { registerUserApi } from "../services/apiService";
import { toast } from "react-toastify";

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (formData, { rejectWithValue }) => {
        try {
            const user = await loginUserApi(formData)
            return user;
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const logoutUser = createAsyncThunk(
    'user/logoutUser',
    async (_, {rejectWithValue}) => {
        try {
            const user = await logoutUserApi();
            return user
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const registerUser = createAsyncThunk(
    'user/registerUser',
    async (formData, { rejectWithValue }) => {
        try {
            const user = await registerUserApi(formData)
            // console.log(user)
            return user;
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const fetchAllUsers = createAsyncThunk(
    'user/fetchAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const users = await getAllUsersApi()
            console.log(users)
            return users;
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const fetchUsersChats = createAsyncThunk(
    'user/fetchUsersChats',
    async (_, { rejectWithValue }) => {
        try {
            const users = await getUsersChatsApi()
            // console.log(users)
            return users;
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const initialState = {
    users: [
        {
            _id: 1,
            firstName: "Priyanshu",
            lastName: "Modi",
            email: "priyanshumodi944@gmail.com"
        },
    ],
    currentUser: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('accessToken'),
    error: null,
    isLoading: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    extraReducers: (builder) => {
            builder
                .addCase(loginUser.pending, (state) => {
                    state.isLoading = true;
                })
                .addCase(loginUser.fulfilled, (state, action) => {
                    const response = action.payload;
                    const user = {
                        _id: response?.user?._id, 
                        firstName: response?.user?.firstName, 
                        lastName: response?.user?.lastName,
                        email: response?.user?.email,
                        role: response?.user?.role
                    }

                    state.isLoading = false;
                    state.currentUser = user;
                    state.isAuthenticated = true;
                    state.error = null;


                    localStorage.setItem('accessToken', response?.accessToken)
                    localStorage.setItem('user', JSON.stringify(user))

                    toast.success(`Welcome ${user.firstName}`)
                })
                .addCase(loginUser.rejected, (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload;
                })
                .addCase(logoutUser.pending, (state) => {
                    state.isLoading = true;
                })
                .addCase(logoutUser.fulfilled, (state) => {
                    state.isLoading = false;
                    state.currentUser = null;
                    state.isAuthenticated = false;
                    state.error = null;
                    state.users = [];

                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('user')
                })
                .addCase(logoutUser.rejected, (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload;
                })
                .addCase(fetchAllUsers.pending, (state) => {
                    state.isLoading = true;
                })
                .addCase(fetchAllUsers.fulfilled, (state, action) => {
                    state.users = action.payload;
                    state.isLoading = false;
                    state.error = null;
                })
                .addCase(fetchAllUsers.rejected, (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload;
                })
                .addCase(fetchUsersChats.pending, (state) => {
                    state.isLoading = true;
                })
                .addCase(fetchUsersChats.fulfilled, (state, action) => {
                    state.users = action.payload;
                    state.isLoading = false;
                    state.error = null;
                })
                .addCase(fetchUsersChats.rejected, (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload;
                })
                .addCase(registerUser.pending, (state) => {
                    state.isLoading = true;
                })
                .addCase(registerUser.fulfilled, (state, action) => {
                    state.isLoading = false;
                    state.error = null;
                    state.isAuthenticated = false;
                    state.users = [];
                    state.currentUser = null;
                    
                    toast.success(`registeration successfull....`)
                })
                .addCase(registerUser.rejected, (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload;
                })
        }
})

export default userSlice.reducer