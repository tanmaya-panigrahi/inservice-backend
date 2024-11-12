import {Router} from "express";
import {validateClient} from "../validators/client.validator.js";
import {validateRequest} from "../validators/request.validator.js";
import {registerClient, loginClient,logoutClient,requestCreation} from "../controllers/client.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { Client } from "../models/client.model.js";

const clientRouter = Router();


// landing page route - GET



//Register a new client - POST
clientRouter.route("/signup").post(
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


// request by the client - POST

clientRouter.route("/hire").post(
    // verifyJWT(Client),
    // validateRequest,
    requestCreation
);  





// logout a client - POST


export {clientRouter};