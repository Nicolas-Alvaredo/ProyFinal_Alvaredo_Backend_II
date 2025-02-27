import express from "express";
import ProductManager from "../managers/productManager.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function createProductRouter(io) {
    const router = express.Router();
    const productManager = new ProductManager(path.join(__dirname, '../data/products.json'));

    // Obtener todos los productos
    router.get('/', async (req, res) => {
        try {
            const products = await productManager.getProducts();
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Obtener un producto por ID
    router.get('/:pid', async (req, res) => {
        try {
            const product = await productManager.getProductById(req.params.pid);
            res.json(product);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    });

    // Crear un nuevo producto
    router.post('/', async (req, res) => {
        try {
            const newProduct = await productManager.addProduct(req.body);
            const productosActualizados = await productManager.getProducts();
            io.emit("productos", productosActualizados); // Emitimos la actualización
            res.status(201).json(newProduct);
        } catch (error) {
            console.error("Error en POST /api/products:", error.message); // Agregado para ver errores en consola
            res.status(400).json({ error: error.message });
        }
    });

    // Eliminar un producto
    router.delete('/:pid', async (req, res) => {
        try {
            await productManager.deleteProduct(req.params.pid);
            const productosActualizados = await productManager.getProducts();
            io.emit("productos", productosActualizados); // Emitimos la actualización
            res.json({ message: "Producto eliminado" });
        } catch (error) {
            console.error("Error en DELETE /api/products:", error.message); // Agregado para ver errores en consola
            res.status(404).json({ error: error.message });
        }
    });

    return router;
}
