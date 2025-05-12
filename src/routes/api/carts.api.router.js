import express from "express";
import {
  createCart,
  getCartById,
  addProductToCart,
  removeProductFromCart,
  updateCart,
  updateProductQuantity,
  clearCart,
  getAllCarts
} from "../../controllers/cart.controller.js";
import { generateTicketFromCart } from "../../controllers/ticket.controller.js";
import passport from "../../middlewares/passport-jwt.middleware.js";
import { checkRole } from "../../middlewares/checkRole.js";

const router = express.Router();

// ✅ Rutas protegidas para usuarios autenticados (rol: user)
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  checkRole("user"),
  createCart
);

router.get(
  "/:cid",
  passport.authenticate("jwt", { session: false }),
  checkRole("user"),
  getCartById
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  checkRole("user"),
  getAllCarts
);

router.post(
  "/:cid/products/:pid",
  passport.authenticate("jwt", { session: false }),
  checkRole("user"),
  addProductToCart
);

router.delete(
  "/:cid/products/:pid",
  passport.authenticate("jwt", { session: false }),
  checkRole("user"),
  removeProductFromCart
);

router.put(
  "/:cid",
  passport.authenticate("jwt", { session: false }),
  checkRole("user"),
  updateCart
);

router.put(
  "/:cid/products/:pid",
  passport.authenticate("jwt", { session: false }),
  checkRole("user"),
  updateProductQuantity
);

router.delete(
  "/:cid",
  passport.authenticate("jwt", { session: false }),
  checkRole("user"),
  clearCart
);

// ✅ Ruta para finalizar compra y generar ticket
router.post("/:cid/purchase", passport.authenticate("jwt", { session: false }), checkRole("user"), generateTicketFromCart);

export default router;
