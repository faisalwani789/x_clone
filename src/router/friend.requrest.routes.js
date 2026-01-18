import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { sendRequest } from "../controllers/friendRequrest.controller.js";
const router=Router()
router.post('/',sendRequest)


export default router