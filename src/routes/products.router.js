import express from "express";
import * as productController from "../controllers/product.controller.js"; // Importamos todos los controladores


const router = express.Router();

router.get("/", productController.getProducts);
router.post("/", productController.addProduct);
router.delete("/:pid", productController.deleteProduct);


export default router;
