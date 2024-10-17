import {Router} from "express";
import {validateBuyer} from "../validators/buyer.validator.js";
import {registerBuyer, loginBuyer,logoutBuyer} from "../controllers/buyer.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { Buyer } from "../models/buyer.model.js";

const buyerRouter = Router();

//Register a new buyer - POST
buyerRouter.route("/register").post(
    validateBuyer,
    registerBuyer
);

//Login a buyer - POST
buyerRouter.route("/login").post(
    loginBuyer
);

// logout a buyer - POST

buyerRouter.route("/logout").post(
    verifyJWT(Buyer),
    logoutBuyer
);




// logout a buyer - POST


export {buyerRouter};