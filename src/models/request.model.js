
import mongoose,{Schema} from "mongoose";



const requestSchema=new Schema({
    contractTitle:{
        type:String,
        required:true,
        trim:true
    },
    contractDescription:{
        type:String,
        required:true,
        trim:true
    },
    paymentType:{
        type:String,
        required:true,
        trim:true
    },
    hourlyRate:{
        type:String,
        default:"0"
    },
    fixedPrice:{
        type:String,
        default:"0"
    },
    startDate:{
        type:Date,
        required:true
    },
    requestImage:{
        type:String,
        default:""
    },
    clientId:{
        type:Schema.Types.ObjectId,
        ref:"Client"
    },
    vendorId:{
        type:Schema.Types.ObjectId,
        ref:"Vendor",
        default:null
    },
    status:{
        type: String,
        enum: ['Not Accepted', 'In Progress', 'Completed', 'Rejected'],
        default: 'Not Accepted',
    },
    
},{timestamps:true});



const Request=mongoose.model("Request",requestSchema);
export {Request};
