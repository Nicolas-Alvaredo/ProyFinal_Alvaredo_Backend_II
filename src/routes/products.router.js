import express from "express";
import {
  getProducts,
  addProduct,
  deleteProduct
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", addProduct); 
router.delete("/:pid", deleteProduct);

export default router;
