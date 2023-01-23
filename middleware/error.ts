import ErrorResponse from "../utils/errorResponse";
import { Request, NextFunction, Response } from 'express';
import { Error as MongooseError } from "mongoose";

type ErrorType = {
    name: string;
    statusCode: number;
    message: string
}
const errorHandler = (err: any,  res: Response, next: NextFunction) => {
    let error: ErrorType = { ...err }
    error.message = err.message

    if (err.code === 11000) {
        const message: string = "Duplicate Field Value"
        error = new ErrorResponse(message, 400)
    }
    else if (error.name === "ValidationError") {
        //need better types for this
        const message: string[] = Object.values(err.errors).map((val: any) => val.message)
        error = new ErrorResponse(message[0], 400)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server error"
    })
}

export default errorHandler