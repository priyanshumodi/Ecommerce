import razorpayInstance from "../config/razorpay.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import crypto from 'crypto'
// import 'dotenv/config'

const createOrder = async (req, res) => {
    try {
        const price = req.body?.amount;
        const options = {
            amount: price*100,
            currency: 'INR',
            receipt: 'receipt_order_123'
        }

        const order = await razorpayInstance.orders.create(options)
        return res.status(200).json(new ApiResponse(200, order, "order initiated successfully"))
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: error.message })
    }
}


const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body

        const sign = razorpay_order_id + '|' + razorpay_payment_id;

        console.log(sign)

        const data = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(sign.toString());

        const expectedSignature = data.digest('hex')

        console.log(razorpay_signature, expectedSignature)

        if (razorpay_signature === expectedSignature) {
            console.log('payment successfully')
            return res.status(200).json(new ApiResponse(200, {}, "Payment verified and processed successfully."));
        } else {
            return res.status(400).json({success: false, statusCode: 400, message: "payment verfication failed, Invalid Signature" })
        }

    } catch (error) {
        console.log('fat gya lala')
        return res.status(500).json({ statusCode: 500, message: error.message })

    }
}

export {
    createOrder,
    verifyPayment
}