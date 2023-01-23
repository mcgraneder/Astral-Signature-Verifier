
import { Request, Response, NextFunction } from "express"

export const verify = (req: Request, res: Response, next: NextFunction) => {
    res.send("Verify route")

}

const x = () => import("../routes/auth")