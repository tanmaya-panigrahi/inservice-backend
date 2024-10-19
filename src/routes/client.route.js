import {Router} from "express";
import {validateClient} from "../validators/client.validator.js";
import {registerClient, loginClient,logoutClient} from "../controllers/client.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { Client } from "../models/client.model.js";

const clientRouter = Router();

//Register a new client - POST
clientRouter.route("/register").post(
    validateClient,
    registerClient
);

//Login a client - POST
clientRouter.route("/login").post(
    loginClient
);

// logout a client - POST

clientRouter.route("/logout").post(
    verifyJWT(Client),
    logoutClient
);




// logout a client - POST


export {clientRouter};