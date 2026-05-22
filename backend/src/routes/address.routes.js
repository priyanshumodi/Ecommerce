import { Router } from "express";
import {
    addAddress,
    getAllAddress
} from '../controllers/address.controller.js'

const router = Router();

router.post("/add", addAddress);
router.get('/', getAllAddress);

export default router;