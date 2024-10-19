import { Router } from "express";
import { validateVendor } from "../validators/vendor.validator.js";
import { registerVendor, loginVendor, logoutVendor } from "../controllers/vendor.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Vendor } from "../models/vendor.model.js";

const vendorRouter = Router();

//Register a new vendor - POST
vendorRouter.route("/register").post(
    validateVendor,
    registerVendor
);

//Login a vendor - POST
vendorRouter.route("/login").post(
    loginVendor
);


//Secured routes
//Logout a vendor - POST
vendorRouter.route("/logout").post(
    verifyJWT(Vendor),
    logoutVendor
);

export { vendorRouter };
