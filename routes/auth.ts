import express, { Router } from "express"
import { register, verify, test, testregister } from '../controllers/auth';

const router: Router = express.Router()

//router routes
router.route("/verify").post(verify)
router.route("/register").post(register)
router.route("/test").post(testregister)



export default router