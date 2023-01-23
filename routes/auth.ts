import express, { Router } from "express"
import { register, verify } from "../controllers/auth"

const router: Router = express.Router()

//router routes
router.route("/verify").post(verify)
router.route("/verify").post(register)

export default router