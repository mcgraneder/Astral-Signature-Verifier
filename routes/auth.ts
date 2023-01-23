import express, { Router } from "express"
import { verify } from "../controllers/auth"

const router: Router = express.Router()

//router routes
router.route("/verify").post(verify)

export default router