
import { Request, Response, NextFunction } from "express"
import { Document, Types } from "mongoose";
import User, { IUser } from "../models/User"
import { ethers } from 'ethers';
import { hashMessage } from "@ethersproject/hash";
const ErrorResponse = require("../utils/errorResponse");
const { recoverPersonalSignature } = require("eth-sig-util");
const  { bufferToHex } = require("ethereumjs-util");

export type User = Document<unknown, any, IUser> & IUser & {
    _id: Types.ObjectId;
}

export const verify = async(req: Request, res: Response, next: NextFunction) => {
    const { signature, nonce, publicAddress, } = req.body;
    const userExists = await doesUserExist(publicAddress)

    if (!nonce || !signature) {
        return next(new ErrorResponse(
            "User already exists. please use a unique address", 400, 3
        ));
    }
    try {
        const msg = getMessage(nonce)
        const recoveredAddress = ethers.utils.recoverAddress(
            hashMessage(msg), signature
        );

		if (recoveredAddress.toLowerCase() === publicAddress.toLowerCase()) {
            const nonce: number = Math.floor(Math.random() * 10000);
            if (!userExists) {
                const user: User | null = await User.create({
                    publicAddress, nonce
                })
                 sendToken(user!, 200, res);
            } else {
                const user: User | null = await User.findOne({ publicAddress })
                 sendToken(user!, 200, res);
            }
		} else {
			res.status(401).send({
				error: 'Signature verification failed',
			});
		}
    } catch(err: unknown) {
        next(err);
    }
}

const getMessage = (nonce: number): string => {
    return `Alpha-Bridge Onboarding unique one-time nonce: ${nonce} by signimg this you are verifying your ownership of this wallet`;
}

const doesUserExist = async(publicAddress: string): Promise<boolean> => {
    const user: User | null = await User.findOne({ publicAddress })
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

