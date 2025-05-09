import mongoose from "mongoose"; 
import Product from '../daos/mongodb/models/product-model.js';

export const getProducts = async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);

        let filter = {};
        if (query) {
            filter = { category: query }; // Verifica si `query` está filtrando mal
        }

        const options = {
            limit,
            page,
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
            collation: { locale: "en", strength: 2 } // Evita problemas con mayúsculas/minúsculas
        };

        const products = await Product.paginate(filter, options);

        res.json({
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}` : null,
            nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}` : null
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await Product.findById(pid);
  
      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
  
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

export const addProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        let { pid } = req.params;
        
        // Convertimos pid en un ObjectId válido
        pid = pid.trim(); // Elimina espacios extra
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).json({ error: "ID de producto inválido" });
        }

        const deletedProduct = await Product.findByIdAndDelete(new mongoose.Types.ObjectId(pid));
        if (!deletedProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json({ message: "Producto eliminado correctamente", deletedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};