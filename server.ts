require("dotenv").config({ path: "./config.env" })
import { AuthContoller } from "./types"

import express, { Express } from "express"

const app: Express = express()

app.use(express.json())
app.use("/api/auth", (): Promise<AuthContoller> => import("./routes/auth"))

const PORT: string | number = process.env.port || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))