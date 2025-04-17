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
} from "../controllers/cart.controller.js";

const router = express.Router();

// ✅ CREAR UN NUEVO CARRITO VACÍO
router.post("/", createCart);

// ✅ OBTENER UN CARRITO POR ID (JSON)
router.get("/:cid", getCartById);

// ✅ OBTENER TODOS LOS CARRITOS (JSON)
router.get("/", getAllCarts);

// ✅ AGREGAR UN PRODUCTO AL CARRITO
router.post("/:cid/products/:pid", addProductToCart);

// ✅ ELIMINAR UN PRODUCTO DEL CARRITO
router.delete("/:cid/products/:pid", removeProductFromCart);

// ✅ ACTUALIZAR TODO EL CARRITO CON UN ARRAY NUEVO DE PRODUCTOS
router.put("/:cid", updateCart);

// ✅ ACTUALIZAR SOLO LA CANTIDAD DE UN PRODUCTO
router.put("/:cid/products/:pid", updateProductQuantity);

// ✅ VACIAR EL CARRITO COMPLETAMENTE
router.delete("/:cid", clearCart);

export default router;