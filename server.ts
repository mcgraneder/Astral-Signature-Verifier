import express, { Express} from "express"

const app: Express = express()
const PORT: string | number = process.env.port || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))