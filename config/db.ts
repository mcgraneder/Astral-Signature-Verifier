require("dotenv").config({ path: "./config.env" })
import mongoose from "mongoose";

export const connectToDB = async (): Promise<void> => {
  mongoose
    .connect("mongodb+srv://mcgrane5:Dj8amdbk@astralbridgecluster.llzzchs.mongodb.net/test", 
    { retryWrites: true, w: "majority" })
    .then(() => {
      console.log("connected to mongo");
    })
    .catch((error: Error) => console.error(error));
};

export default connectToDB
