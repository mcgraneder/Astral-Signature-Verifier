import { Request, Response, NextFunction } from "express"

export const getPrivateData = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        data: "you have ben granted access"
    })
}