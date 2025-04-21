import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiErrorToJSON } from "./middlewares/ApiErrorToJSON.middleware.js";

const app = express();

app.use(cors({
    origin: "https://inservice-dusky.vercel.app", // Allow requests from your frontend
    credentials: true, // Allow cookies to be sent
}));

app.use(express.json({
    limit: "50mb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "50mb"
}));

app.use(express.static("public"));

app.use(cookieParser());


// Handling routers

// vendor router
import { vendorRouter } from "./routes/vendor.route.js";
app.use("/api/v1/vendors", vendorRouter);


// client router
import { clientRouter } from "./routes/client.route.js";
app.use("/api/v1/clients", clientRouter);

//To explicitly convert any left over error to JSON format
app.use(ApiErrorToJSON);

app.get("/", (req, res) => {
    res.send("Welcome to InService API");
});

export { app };

