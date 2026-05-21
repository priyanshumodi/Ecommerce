import { Router } from "express";
import {
    getAllOrders,
    myOders,
    addOrder,
    updateOrder,
    deleteOrder
} from '../controllers/order.controller.js'
import {isAdmin} from '../middlewares/adminAuth.middleware.js'

const router = Router();

router.route('/').get(isAdmin, getAllOrders);
router.route('/myOrders').get(myOders)
router.route('/:productId').post(addOrder);
router.route('/:orderId').patch(updateOrder).delete(deleteOrder);

export default router