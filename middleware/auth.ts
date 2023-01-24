const jwt = require("jsonwebtoken")
import User from '../models/User';
import ErrorResponse from "../utils/errorResponse";
import { Request, Response, NextFunction } from "express"
import { Document, Types } from "mongoose";
import { IUser } from '../models/User';

type MiddlewareUser = Document<unknown, any, IUser> & IUser & {
    _id: Types.ObjectId;
}
interface IMiddleWareUser extends Request {
    user: MiddlewareUser | null
}
export const protect = async(req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;
    console.log(req.headers.authorization)
    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
        return next(
            res.status(401).send({
				error: 'not authorized to access this route',
			})
        );
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user: MiddlewareUser | null = await User.findById(decoded.id);

        if (!user) {
            return next(
                res.status(401).send({
				error: 'No user found with this ID',
			})
            );
        }
        //@ts-ignore
        req.user = user;
        next();
    } catch (err) {
        console.log(err)
        return next(
            res.status(401).send({
				error: 'not authorized to access this route',
			})
        );
    }
}