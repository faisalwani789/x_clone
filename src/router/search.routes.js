import { Router } from "express";
import {getSearchResults } from "../controllers/search.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router=Router()

router.get('/',getSearchResults)

export default router