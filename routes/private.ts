import express, { Router } from "express"
import { getPrivateData } from "../controllers/private"
import { protect } from "../middleware/auth"

const privateRouter: Router = express.Router()

//router routes
privateRouter.route("/").get(protect, getPrivateData)

export default privateRouter