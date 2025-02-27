// Gestión de productos
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.initFile();
    }

    // Inicializar el archivo si no existe
    async initFile() {
        try {
            await fs.access(this.path);
        } catch (error) {
            await fs.writeFile(this.path, JSON.stringify([]), 'utf-8');
        }
    }

    // Obtener todos los productos
    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            throw new Error(`Error al leer productos: ${error.message}`);
        }
    }

    // Obtener un producto por ID
    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find(prod => prod.id.toString() === id.toString());
        if (!product) throw new Error(`No se encontró el producto con ID: ${id}`);
        return product;
    }

    // Agregar un producto
    async addProduct({ title, description, code, price, stock, category, thumbnails = [], status = true }) {
        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error("Todos los campos son obligatorios.");
        }

        const products = await this.getProducts();
        if (products.some(prod => prod.code === code)) {
            throw new Error(`El código "${code}" ya está en uso.`);
        }

        const newProduct = {
            id: crypto.randomUUID(),
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails,
            status
        };

        products.push(newProduct);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return newProduct;
    }

    // Actualizar un producto
    async updateProduct(id, updatedFields) {
        const products = await this.getProducts();
        const index = products.findIndex(prod => prod.id.toString() === id.toString());

        if (index === -1) throw new Error(`No se encontró el producto con ID: ${id}`);

        if (updatedFields.id) {
            throw new Error("No se puede actualizar el ID del producto.");
        }

        products[index] = { ...products[index], ...updatedFields };
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return products[index];
    }

    // Eliminar un producto
    async deleteProduct(id) {
        let products = await this.getProducts();
        const newProducts = products.filter(prod => prod.id.toString() !== id.toString());

        if (products.length === newProducts.length) throw new Error(`No se encontró el producto con ID: ${id}`);

        await fs.writeFile(this.path, JSON.stringify(newProducts, null, 2));
        return { message: `Producto con ID ${id} eliminado.` };
    }
}

export default ProductManager;

