import { Product } from "../models/product.model.js"
import { ApiResponse } from "../utilities/ApiResponse.js"

const allProducts = async (req, res) => {
    try {
        const cacheKey = 'products:all';

        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
            console.log("🚀 Serving from REDIS CACHE (Super fast!)");
            return res.status(200).json({statusCode: 200, products: JSON.parse(cachedData), message: "All products fetched" })
        }

        console.log("Cache Miss! Fetching from MongoDB...");
        const products = await Product.find({});

        // 'EX', 3600 means this cache expires and refreshes automatically every 1 hour
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(products));

        return res.status(200).json({statusCode: 200, products, message: "All products fetched" })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getProduct = async (req, res) => { }

const addProduct = async (req, res) => {
    try {
        const { name, description, price, image, quantity, category } = req.body;

        console.log(name, description, price, image, quantity, category)

        if (([name, description, image, category].some((field) => (field?.trim() === ''))) || (!price || !quantity)) {
            return res.status(400).json({ message: "All field are required" });
        }

        const product = await Product.create(
            { name, description, price, image, quantity, category }
        )

        return res.status(200).json(new ApiResponse(200, product, "product added succefully"))
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).json({ message: "product does not exist" });
        }

        const updateData = {}

        if (req.body.name) updateData.name = req.body.name;
        if (req.body.description) updateData.description = req.body.description;
        if (req.body.price) updateData.price = req.body.price;
        if (req.body.image) updateData.image = req.body.image;
        if (req.body.quantity) updateData.quantity = req.body.quantity;
        if (req.body.category) updateData.category = req.body.category;

        const updateProduct = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })

        return res.status(200).json({ product: updateProduct, message: "Product Updated Successfully" })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(id)

        const product = await Product.findOne({ _id: id });

        if (!product) {
            return res.status(404).json({ message: "Product does not exist" });
        }

        const deleteProduct = await Product.findByIdAndDelete(id)

        return res.status(200).json({ deleteProduct, message: "productd deleted successfully" })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}



export {
    allProducts,
    addProduct,
    updateProduct,
    deleteProduct
}