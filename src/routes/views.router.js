import express from "express";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

const router = express.Router();

// Página principal con paginación y botón "Agregar al carrito"
router.get("/products", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        
        // Filtrar por categoría o búsqueda
        const filter = query ? { 
            $or: [
                { category: { $regex: query, $options: "i" } }, // Búsqueda por categoría
                { title: { $regex: query, $options: "i" } } // Búsqueda por título
            ] 
        } : {};

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
            lean: true // Mejora el rendimiento en Handlebars
        };

        const products = await Product.paginate(filter, options);

        res.render("home", {
            title: "Lista de Productos",
            productos: products.docs, // Enviamos los productos a la vista
            pagination: {
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}&limit=${limit}` : null,
                nextLink: products.hasNextPage ? `/products?page=${products.nextPage}&limit=${limit}` : null,
            },
        });
    } catch (error) {
        console.error("❌ Error al cargar productos:", error);
        res.status(500).send("Error al cargar productos");
    }
});

// Vista de detalles de producto con botón "Agregar al carrito"
router.get("/products/:pid", async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid).lean();
        if (!product) return res.status(404).send("Producto no encontrado");

        res.render("productDetail", { title: "Detalle del Producto", product });
    } catch (error) {
        console.error("❌ Error al cargar detalles del producto:", error);
        res.status(500).send("Error al cargar detalles del producto");
    }
});


// Vista de carrito con productos populados
router.get("/carts/:cid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate("products.product");
        if (!cart) return res.status(404).send("Carrito no encontrado");

        res.render("cartDetail", { title: "Carrito", cart });
    } catch (error) {
        res.status(500).send("Error al cargar el carrito");
    }
});

export default router;
