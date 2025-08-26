import pkg from "jsonwebtoken";const { TokenExpiredError } = pkg;

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async ()=>{
       try {
           mongoose.connection.on('connected', ()=> console.log("Database Connected")
           );
           await mongoose.connect(`${process.env.MONGODB_URI}/greencart`)
      } catch (error) {
            console.error(error.message);
        }

}
export default connectDB