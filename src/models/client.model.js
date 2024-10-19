import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// creating the client registration schema
const clientSchema = new Schema({
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
    location:{
        type: String,
        default: "",
        required:true
    },
    // requests:{
    //     type:Schema.Types.ObjectId,
    //     ref:"Request"
    // },
    refreshToken: {
        type: String,
        default: ""
    }


}, { timestamps: true });

// hashing the password before saving the client registration details
clientSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


// Method to check password
clientSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};


// Method to generate acccess token
clientSchema.methods.generateAccessToken = function () {
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

// Method to generate refresh token
clientSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,


        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )

}


// exporting the client registration model
export const Client = mongoose.model("Client", clientSchema);