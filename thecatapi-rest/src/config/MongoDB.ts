import mongoose from 'mongoose'
import { DATABASE_URI } from './EnvVariables';

export const MongoDBConnection = async () => {
    mongoose.set('strictQuery', false);
    await mongoose.connect(DATABASE_URI!, {});
    console.log("Database connection was successfully");
}
