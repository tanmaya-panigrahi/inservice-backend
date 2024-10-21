
import mongoose,{Schema} from "mongoose";



const requestSchema=new Schema({
    requestTitle:{
        type:String,
        required:true,
        trim:true
    },
    requestDescription:{
        type:String,
        required:true,
        trim:true
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
        enum: ['open', 'in-progress', 'completed', 'canceled'],
        default: 'open',
    },
    category: {
        type: String,
        required: true,
    },
    budget: {
        type: Number,  // Budget as a number (e.g., $100)
        required: true,
    },
    attachments: {
        type: String,  // Array of file URLs or paths
        default: "",
    },
},{timestamps:true});



const Request=mongoose.model("Request",requestSchema);
export {Request};
