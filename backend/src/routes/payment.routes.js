import { Router } from "express";
import { createOrder, verifyPayment } from "../controllers/payment.controller.js";

const router = Router()

router.route('/order').post(createOrder)
router.route('/verify').post(verifyPayment)

export default router