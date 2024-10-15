import { Router } from "express";
import { validateSeller } from "../validators/seller.validator.js";
import { registerSeller } from "../controllers/seller.controller.js";

const sellerRouter = Router();

//Register a new seller - POST
sellerRouter.route("/register").post(
    validateSeller,
    registerSeller
);

//Login a seller - POST
sellerRouter.route("/login").post();

//Logout a seller - POST
sellerRouter.route("/logout").post();

export { sellerRouter };
