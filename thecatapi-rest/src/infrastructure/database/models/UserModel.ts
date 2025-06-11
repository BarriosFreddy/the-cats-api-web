import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: { type: String, }
});

export const UserModel = mongoose.model("User", UserSchema);
