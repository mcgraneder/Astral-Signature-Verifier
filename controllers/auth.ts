
import { Request, Response, NextFunction } from "express"
import { Document, Types } from "mongoose";
import User, { IUser } from "../models/User"
const ErrorResponse = require("../utils/errorResponse");
const { recoverPersonalSignature } = require("eth-sig-util");
const  { bufferToHex } = require("ethereumjs-util");


export type User = Document<unknown, any, IUser> & IUser & {
    _id: Types.ObjectId;
}

export const testregister = async(req: Request, res: Response, next: NextFunction) => {
    const { nonce, publicAddress, } = req.body;
    console.log(publicAddress)
    const userExists = await doesUserExist(publicAddress)

    if (!nonce || userExists) {
        // return next(new ErrorResponse(
        //     "User already exists. please use a unique address", 400, 3
        // ));
    }
    try {
       
		 const nonce: number = Math.floor(Math.random() * 10000);
            const user: User | null = await User.create({
                publicAddress, nonce
            })
            sendToken(user!, 200, res);
	
		    } catch(err: unknown) {
        next(err);
    }
}


export const register = async(req: Request, res: Response, next: NextFunction) => {
    const { signature, nonce, publicAddress, } = req.body;
    const userExists = await doesUserExist(publicAddress)

    if (!nonce || !signature || userExists) {
        return next(new ErrorResponse(
            "User already exists. please use a unique address", 400, 3
        ));
    }
    try {
        const msg = getMessage(nonce)
		const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
		const recoveredAddress = recoverPersonalSignature(
            {data: msgBufferHex, sig: signature.signature}
        );

		if (recoveredAddress.toLowerCase() === publicAddress.toLowerCase()) {
            const nonce: number = Math.floor(Math.random() * 10000);
            const user: User | null = await User.create({
                publicAddress, nonce
            })
            sendToken(user!, 200, res);
		} else {
			res.status(401).send({
				error: 'Signature verification failed',
			});
		}
    } catch(err: unknown) {
        next(err);
    }
}

export const verify = async(req: Request, res: Response, next: NextFunction) => {
    const { signature, nonce, publicAddress, } = req.body;
    const user: User | null = await User.findOne({ publicAddress }).select("+publicAddress");

    if (!nonce || !user || !signature) {
        return next(new ErrorResponse(
            "Please provider a public address and nonce", 400, 3
        ));
    }
    try {
        const msg = getMessage(nonce)

		const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
		const recoveredAddress = recoverPersonalSignature(
            {data: msgBufferHex, sig: signature.signature}
        );

		if (recoveredAddress.toLowerCase() === publicAddress.toLowerCase()) {
            sendToken(user!, 200, res);
		} else {
			res.status(401).send({
				error: 'Signature verification failed',
			});
		}
    } catch(err: unknown) {
        next(err);
    }
}

export const test = async(req: Request, res: Response, next: NextFunction) => {
    console.log(req.body)
    res.send("helloooo")
}
const getMessage = (nonce: number): string => {
    return `Alpha-Bridge Onboarding unique one-time nonce: ${nonce} by signimg this you are verifying your ownership of this wallet`;
}

const doesUserExist = async(publicAddress: string): Promise<boolean> => {
    const user: User | null = await User.findOne({ publicAddress }).select("+publicAddress");
    return user ? true : false
}
const sendToken = (user: any, statusCode: number, response: Response) => {
    const token = user.getSignedToken();
    user?.save();
    response.status(statusCode).json({ 
        success: true,
        token
    })
}

