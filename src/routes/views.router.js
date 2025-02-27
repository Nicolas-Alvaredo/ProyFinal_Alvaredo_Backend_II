import express from "express";
import { productManager } from "../app.js";

const router = express.Router();

// Home: Mostrar todos los productos
router.get("/", async (req, res) => {
    const productos = await productManager.getProducts();
    res.render("home", { title: "Lista de Productos", productos });
});

// RealTime Products: WebSockets
router.get("/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts", { title: "Productos en Tiempo Real" });
});

export default router;
