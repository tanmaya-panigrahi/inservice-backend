import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const vendorSchema = new Schema({
    fullName: {
        type: String,
        required: true,
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
    address: {
        type: String,
        required: true, // Used to display relevant service requests and recommendations
    },
    // services: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Service', // References the services offered by the provider
    // }],
    // ongoingRequests: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'ServiceRequest', // References the ongoing requests related to this provider
    // },
    vendorServiceName: {
        type: String,
        required: true,
        trim: true
    },
    vendorDescription: {
        type: String,
        trim: true
    },
    phoneNo: {
        type: String,
        required: true,
        trim: true
    },
    category:{
        type: String,
        required: true,
        trim: true
    },
    ratings: {
        type: Number,
        default: 0
    },

    refreshToken: {
        type: String,
        default: ""
    },


}, { timestamps: true });


// Hash password before saving
vendorSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


// Method to check password validity
vendorSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};


// methodod to generate access token
vendorSchema.methods.generateAccessToken = function () {
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

// method to generate refresh token
vendorSchema.methods.generateRefreshToken = function () {
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


// export the vendor model
export const Vendor = mongoose.model("Vendor", vendorSchema);
