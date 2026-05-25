import mongoose from "mongoose";
import { Order } from "../models/order.model.js";
import { ApiResponse } from "../utilities/ApiResponse.js";

const getAllOrders = async (req, res) => {
    try {
        // const orders = await Order.find({}).populate('customerId').select("-password").populate('productId');
        const orders = await Order.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customerDetails"
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $lookup: {
                    from: "addresses",
                    localField: "addressId",
                    foreignField: "_id",
                    as: "addressDetails"
                }
            },
            {
                $unwind: "$customerDetails"
            },
            {
                $unwind: "$productDetails"
            },
            {
                $unwind: "$addressDetails"
            },
            {
                $project: {
                    customerDetail: {
                        firstName: "$customerDetails.firstName",
                        lastName: "$customerDetails.lastName",
                        email: "$customerDetails.email",
                        age: "$customerDetails.age",
                        role: "$customerDetails.role",
                        gender: "$customerDetails.gender",
                    },
                    productDetail: {
                        name: "$productDetails.name",
                        price: "$productDetails.price",
                        quantity: "$productDetails.quantity",
                        category: "$productDetails.category",
                        image: "$productDetails.image",
                    },
                    addressDetail: {
                        address: "$addressDetails.address",
                        city: "$addressDetails.city",
                        pincode: "$addressDetails.pincode",
                        state: "$addressDetails.state",
                        country: "$addressDetails.country",
                    },
                    quantity: 1,
                    totalPrice: 1,
                    status: 1,
                    createdAt: 1
                }
            }
        ])
        return res.status(200).json(new ApiResponse(200, orders, "all order fetched successfully"))
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: error.message })
    }
}

const myOders = async (req, res) => {
    try {
        const user = req.user;
        console.log(user)

        const orders = await Order.aggregate([
            {
                $match: {
                    customerId: new mongoose.Types.ObjectId(user._id)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customerDetail",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                firstName: 1,
                                lastName: 1,
                                email: 1,
                                age: 1,
                                role: 1,
                                gender: 1,
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "productDetail",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                price: 1,
                                quantity: 1,
                                category: 1,
                                image: 1,
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "addresses",
                    localField: "addressId",
                    foreignField: "_id",
                    as: "addressDetail",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                address: 1,
                                city: 1,
                                pincode: 1,
                                state: 1,
                                country: 1,
                            }
                        }
                    ]
                }
            },
            {
                $unwind: "$customerDetail"
            },
            {
                $unwind: "$productDetail"
            },
            {
                $unwind: "$addressDetail"
            },
            {
                $project: {
                    "customerDetail": 1,
                    "productDetail": 1,
                    "addressDetail": 1,
                    status: 1,
                    quantity: 1,
                    totalPrice: 1,
                    createdAt: 1
                }
            }
        ])

        console.log(orders)
        if (!orders) {
            return res.status(404).json({ statusCode: 404, message: "orders not found" })
        }

        return res.status(200).json(new ApiResponse(200, orders, "fetched all your orders"));
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: error.message })
    }
}

const addOrder = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { productId } = req.params;
        const {quantity, addressId} = req.body;

        console.log("addressID: ", addressId);

        const order = await Order.create({
            customerId: userId,
            productId: productId,
            quantity: quantity,
            totalPrice: 0,
            addressId
        })

        return res.status(200).json(new ApiResponse(200, order, "order added successfully"))
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: error.message })
    }
}

const updateOrder = async (req, res) => {
    try {
        const { quantity, status } = req.body;
        const { orderId } = req.params;
        const user = req.user;

        if (!quantity && status?.trim() === '') {
            return res.status(400).json({ statusCode: 400, message: "some field are required" });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ statusCode: 404, message: "order not found" });
        }

        if (order.customerId.toString() !== user._id.toString()) {
            return res.status(403).json({ statusCode: 403, message: "Access Denied" });
        }

        if (quantity) order.quantity = quantity;
        if (status?.trim()) order.status = status;

        await order.save();

        return res.status(200).json(new ApiResponse(200, order, "order updated successfully"))
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: error.message })
    }

}

const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const user = req.user;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ statusCode: 404, message: "order not found" });
        }

        if (order.customerId.toString() !== user._id.toString()) {
            return res.status(403).json({ statusCode: 403, message: "Access Denied" });
        }

        await order.deleteOne()

        return res.status(200).json(new ApiResponse(200, {}, "order deleted successfully"))
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: error.message })
    }
}

export {
    getAllOrders,
    myOders,
    addOrder,
    updateOrder,
    deleteOrder
}