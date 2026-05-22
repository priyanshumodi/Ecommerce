import { Address } from "../models/address.model.js";

const addAddress = async (req, res) => {
    try {
        const { address, city, pincode, state, country } = req.body;

        if (!address || !city || !pincode || !state) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "All fields (address, city, pincode, state) are required."
            });
        }

        const customerId = req.user?._id;
        if (!customerId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Customer authentication required."
            });
        }

        const newAddress = await Address.create({
            customerId,
            address,
            city,
            pincode,
            state,
            country: country || 'India'
        });

        return res.status(201).json({
            statusCode: 201,
            success: true,
            message: "Address added successfully",
            data: newAddress
        });

    } catch (error) {
        console.error("Error in addAddress controller:", error);
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Internal server error while adding address.",
            error: error.message
        });
    }
};

const getAllAddress = async (req, res) => {
    try {

        const customerId = req.user?._id;
        if (!customerId) {
            return res.status(401).json({
                statusCode: 401,
                success: false,
                message: "Unauthorized. Customer authentication required."
            });
        }

        const addresses = await Address.find({ customerId }).sort({ createdAt: -1 });

        return res.status(200).json({
            statusCode: 200,
            success: true,
            count: addresses.length,
            message: "Addresses fetched successfully.",
            data: addresses
        });

    } catch (error) {
        console.error("Error in getAllAddress controller:", error);
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Internal server error while fetching addresses.",
            error: error.message
        });
    }
};

export {
    addAddress,
    getAllAddress
}