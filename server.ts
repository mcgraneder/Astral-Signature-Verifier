require("dotenv").config({ path: "./config.env" })
import { AuthContoller } from "./types"
import connectToDB from "./config/db"
import express, { Express } from "express"
import http from "http"
import errorHandler from "./middleware/error"

connectToDB()

const app: Express = express()

app.use(express.json())
app.use("/api/auth", (): Promise<AuthContoller> => import("./routes/auth"))
app.use(errorHandler)

const PORT: string | number = process.env.port || 5000

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
 
const StartServer = (): void => {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    http.createServer(app).listen(PORT, async (): Promise<void> => {
        console.log(`Server is running on port ${PORT}`)
    }).close((): void => process.exit(1));
};

process.on("unhandledRejection", (err: Error, promise: Promise<unknown>) => {
    console.log(`Logged error ${err}`)
    server.close((): void => process.exit(1));
})