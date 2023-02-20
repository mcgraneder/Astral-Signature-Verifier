require("dotenv").config({ path: "./config.env" })
import { AuthContoller } from "./types"
import connectToDB from "./config/db"
import express, { Express } from "express"
import http from "http"
import errorHandler from "./middleware/error"
import routes from "./routes/auth"
import privateRoutes from "./routes/private"
import cors from "cors"
import bodyParser = require("body-parser")

const app: Express = express()
app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.status(200).send({ result: "ok" });
});
app.use("/api/auth", routes)
app.use("/api/private", privateRoutes)

app.use(errorHandler)

const PORT: string | number = process.env.port || 8000

// const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
 
const StartServer = (): void => {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    http.createServer(app).listen(PORT, async (): Promise<void> => {
        console.log(`Server is running on port ${PORT}`)
    }).close((): void => process.exit(1));
};

// process.on("unhandledRejection", (err: Error, promise: Promise<unknown>) => {
//     console.log(`Logged error ${err}`)
//     server.close((): void => process.exit(1));
// })

connectToDB().then(() =>
  app.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`);
  }))