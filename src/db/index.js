import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import pusher from "../utils/pusher.js"; // Make sure pusher.js exports a configured Pusher instance

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MONGODB CONNECTION SUCCESSFUL !! DB HOST: ${connectionInstance.connection.host}`);

        // Setup Change Stream for the "requests" collection
        const db = connectionInstance.connection.db;
        const requestsCollection = db.collection("requests");

        const changeStream = requestsCollection.watch();

        // Listen for changes in the "requests" collection
        changeStream.on("change", (change) => {
            if (change.operationType === "insert") {
                const newRequest = change.fullDocument;
                pusher.trigger("requests", "new-request", newRequest);
            } else if (change.operationType === "update") {
                const updatedRequest = change.updateDescription.updatedFields;
                pusher.trigger("requests", "update-request", updatedRequest);
            }
            // You can add more cases here (e.g., delete, replace, etc.)
        });

        console.log("Listening to request changes in MongoDB...");

    } catch (error) {
        console.log("MONGODB CONNECTION ERROR: ", error);
        process.exit(1);
    }
};

export default connectDB;
