import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// creating the buyer registration schema
const buyerSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },  
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: ""
    },
    // wishlist: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Wishlist"
    // },
    // cart: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Cart"
    // },
    // orderHistory: {
    //     type: Schema.Types.ObjectId,
    //     ref: "OrderHistory"
    // }

}, { timestamps: true });

// hashing the password before saving the buyer registration details
buyerSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


// Method to check password
buyerSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};


// Method to generate acccess token
buyerSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


// exporting the buyer registration model
export const Buyer = mongoose.model("Buyer", buyerSchema);