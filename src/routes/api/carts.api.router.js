import express from "express";
import passport from "../../middlewares/passport-jwt.middleware.js";
import { checkRole } from "../../middlewares/checkRole.js";
import {
  addProductToCart,
} from "../../controllers/cart.controller.js";

const router = express.Router();

router.post(
  "/:cid/products/:pid",
  passport.authenticate("jwt", { session: false }),
  checkRole("user"),
  addProductToCart
);

export default router;
