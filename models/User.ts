import mongoose from "mongoose";

export interface IUser {
    publicAddress: string;
    nonce: number
}
const UserSchema: mongoose.Schema<
    IUser, mongoose.Model<
    IUser, any, any, any, any>, {}, {}, {}, {},
    mongoose.DefaultSchemaOptions, IUser
> = new mongoose.Schema<IUser>({
    publicAddress: {
        type: String,
        required: [true, "ENS address is required"],
        unique: true,
    },
    nonce: {
        type: Number,
        required: [true, "Nonce is required"],
        unique: false,
        select: false
    }
})

const User: mongoose.Model<
    IUser, {}, {}, {}, any
> = mongoose.model<IUser>("User", UserSchema)

export default User