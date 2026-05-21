import express from 'express'
import cors from 'cors'
import userRouter from './routes/user.routes.js'
import productRouter from './routes/product.routes.js'
import orderRouter from './routes/order.routes.js'
import messageRouter from './routes/message.routes.js'
import paymentRouter from './routes/payment.routes.js'
import cookieParser from 'cookie-parser';
import { verifyJWT } from './middlewares/auth.middleware.js';


const app = express();

const corsOptions = {
    // 1. Specify the exact origin of your React app
    origin: 'http://localhost:5173', 
    
    // 2. Allow cookies to be passed
    credentials: true,
    
    // 3. (Optional) Helpful for preflight requests
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
};

app.use(cors(corsOptions))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(cookieParser())

// routers 
app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/orders', verifyJWT, orderRouter)
app.use('/api/messages', verifyJWT, messageRouter)
app.use('/api/payment', verifyJWT, paymentRouter)

export { app }