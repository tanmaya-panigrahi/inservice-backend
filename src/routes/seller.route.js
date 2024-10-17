import { Router } from "express";
import { validateSeller } from "../validators/seller.validator.js";
import { registerSeller, loginSeller, logoutSeller } from "../controllers/seller.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Seller } from "../models/seller.model.js";

const sellerRouter = Router();

//Register a new seller - POST
sellerRouter.route("/register").post(
    validateSeller,
    registerSeller
);

//Login a seller - POST
sellerRouter.route("/login").post(
    loginSeller
);


//Secured routes
//Logout a seller - POST
sellerRouter.route("/logout").post(
    verifyJWT(Seller),
    logoutSeller
);

export { sellerRouter };
