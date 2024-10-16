import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiErrorToJSON } from "./middlewares/ApiErrorToJSON.middleware.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
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
import { sellerRouter } from "./routes/seller.route.js";
app.use("/api/v1/sellers", sellerRouter);

//To explicitly convert any left over error to JSON format
app.use(ApiErrorToJSON);

export { app };

