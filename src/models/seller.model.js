import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const sellerSchema = new Schema({
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
    storeName: {
        type: String,
        required: true,
        trim: true
    },
    storeDescription: {
        type: String,
        trim: true
    },
    avatar: {
        type: String,
        default: ""
    },
    phoneNo: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    ratings: {
        type: Number,
        default: 0
    },
    location: {
        country: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
    }


}, { timestamps: true });


// Hash password before saving
sellerSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


// Method to check password validity
sellerSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};


// methodod to generate access token
sellerSchema.methods.generateAccessToken = function () {
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
sellerSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            
            
        },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
    )
    
}


// export the seller model
export const Seller = mongoose.model("Seller", sellerSchema);
