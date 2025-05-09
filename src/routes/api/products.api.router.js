import express from "express";
import * as productController from "../../controllers/product.controller.js";
import passport from "../../middlewares/passport-jwt.middleware.js";
import { checkRole } from "../../middlewares/checkRole.js";


const router = express.Router();

// Todos pueden ver productos
router.get("/", productController.getProducts);
router.get("/:pid", productController.getProductById);

// Solo admin puede crear y eliminar productos
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  checkRole("admin"),
  productController.addProduct
);

router.delete(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  checkRole("admin"),
  productController.deleteProduct
);

export default router;
