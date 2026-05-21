import api from "./apiConfig";

// User Services
export const loginUserApi = async (formData) => {
    try {
        const response = await api.post('/users/login', formData);
        console.log(response)
        return response?.data?.data;
    } catch (error) {
        throw error.message;
    }

}

export const registerUserApi = async (formData) => {
    try {
        const response = await api.post('/users/register', formData);
        // console.log(response)
        return response?.data?.data;
    } catch (error) {
        throw error.message;
    }

}

export const getAllUsersApi = async () => {
    try {
        const response = await api.get('/users/admin/getAllUser')
        // console.log(response)
        return response.data.data;
    } catch (error) {
        throw error.message;
    }
}

export const getUsersChatsApi = async () => {
    try {
        const response = await api.get('/users/chat')
        // console.log(response)
        return response.data.data;
    } catch (error) {
        throw error.message;
    }
}

export const logoutUserApi = async () => {
    try {
        const response = await api.post('users/logout');
        console.log(response)
    } catch (error) {
        throw error.message
    }
}





// Product Services
export const getAllProductApi = async () => {
    try {
        const response = await api.get('/products')
        console.log(response)
        return response.data.products;
    } catch (error) {
        throw error.message;
    }
}

export const deleteProductApi = async (productId) => {
    try {
        const response = await api.delete(`/products/${productId}`)
        console.log(response)
        // return response.data.products;
    } catch (error) {
        throw error.message;
    }
}


// Order Services

export const getAllOrdersApi = async () => {
    try {
        const response = await api.get('/orders')
        // console.log(response.data.data)
        return response.data.data;
    } catch (error) {
        throw error.message;
    }
}

export const getMyOrdersApi = async () => {
    try {
        const response = await api.get('/orders/myOrders')
        // console.log(response)
        return response.data.data;
    } catch (error) {
        throw error.message;
    }
}

export const addOrderApi = async (formData) => {
    try {
        const response = await api.post(`/orders/${formData.productId}`, {quantity: formData.quantity})
        // console.log(response)
        return response.data;
    } catch (error) {
        throw error.message;
    }
}

export const deleteOrderApi = async (productId) => {
    try {
        const response = await api.delete(`/orders/${productId}`)
        // console.log(response)
        return response.data;
    } catch (error) {
        throw error.message;
    }
}

// messages
export const getUsersMessageApi = async (_id) => {
    try {
        console.log(_id)
        const response = await api.get(`/messages/${_id}`)
        // console.log(response)
        return response.data.data;
    } catch (error) {
        throw error.message;
    }
}