import { Router } from "express";
import {
    allProducts,
    addProduct,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js'
import { isAdmin } from "../middlewares/adminAuth.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/').get(allProducts);

router.route('/add').post(verifyJWT, isAdmin, addProduct);

router.route('/:id').patch(verifyJWT, isAdmin, updateProduct).delete(verifyJWT, isAdmin, deleteProduct);

export default router;