import Cart from "../daos/mongodb/models/cart-model.js";
import Product from "../daos/mongodb/models/product-model.js";

// ✅ CREAR UN NUEVO CARRITO VACÍO 
export const createCart = async (req, res) => {
    try {
        const newCart = new Cart({ products: [] });
        const savedCart = await newCart.save();
        console.log("🛒 Nuevo carrito creado en MongoDB:", savedCart._id); // 👀 Verificar en consola
        res.status(201).json(savedCart);
    } catch (error) {
        console.error("❌ Error al crear el carrito:", error);
        res.status(500).json({ message: "Error al crear el carrito", error });
    }
};



// ✅ OBTENER UN CARRITO POR ID
export const getCartById = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid).populate("products.product");

        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

        res.json(cart);
    } catch (error) {
        console.error("❌ Error al obtener el carrito:", error);
        res.status(500).json({ message: "Error al obtener el carrito", error });
    }
};




/**
 * Obtener todoslos carritos
 */
export const getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.find().populate("products.product");
        res.json({ status: "success", payload: carts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ✅ AGREGAR UN PRODUCTO AL CARRITO (con actualización en tiempo real)
export const addProductToCart = async (req, res) => {
    try {
        let { cid, pid } = req.params;
        const { quantity } = req.body;

        const io = req.app.get("io"); // ✅ Obtiene el WebSocket desde `app.js`

        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

        const product = await Product.findById(pid);
        if (!product) return res.status(404).json({ message: "Producto no encontrado" });

        const requestedQuantity = quantity || 1;
        if (product.stock < requestedQuantity) {
            return res.status(400).json({ message: "Stock insuficiente" });
        }

        // ✅ Agregar producto al carrito
        const existingProductIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += requestedQuantity;
        } else {
            cart.products.push({ product: pid, quantity: requestedQuantity });
        }

        // ✅ Restar stock
        product.stock -= requestedQuantity;
        await product.save();
        await cart.save();

        // ✅ Emitir actualización a `/products` y `/carts/:cid`
        io.emit("productosActualizados", await Product.find()); // 🔄 Actualiza lista de productos
        io.emit("carritoActualizado", await Cart.findById(cid).populate("products.product")); // 🔄 Actualiza vista del carrito

        res.json({ message: "Producto agregado al carrito", cart });

    } catch (error) {
        console.error("❌ Error al agregar producto al carrito:", error);
        res.status(500).json({ message: "Error al agregar producto al carrito", error });
    }
};




// ✅ ELIMINAR UN PRODUCTO DEL CARRITO (con actualización en tiempo real)
export const removeProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const io = req.app.get("io");

        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

        // Buscar el producto en el carrito
        const productInCart = cart.products.find(p => p.product.toString() === pid);
        if (!productInCart) return res.status(404).json({ message: "Producto no encontrado en el carrito" });

        // ✅ **Devolver stock al eliminar**
        const product = await Product.findById(pid);
        if (product) {
            product.stock += productInCart.quantity;
            await product.save();
        }

        // ✅ **Eliminar el producto del carrito**
        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save();

        // 🔄 Emitir actualización en tiempo real
        io.emit("productosActualizados", await Product.find());
        io.emit("carritoActualizado", await Cart.findById(cid).populate("products.product"));

        res.json({ message: "Producto eliminado del carrito", cart });
    } catch (error) {
        console.error("❌ Error al eliminar producto del carrito:", error);
        res.status(500).json({ message: "Error al eliminar producto del carrito", error });
    }
};




/**
 * Actualizar todos los productos del carrito
 */
export const updateCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;

        console.log("🟢 Data recibida en PUT /api/carts/:cid:", req.body); // 🛠️ LOG PARA DEPURACIÓN

        // Verifica si `products` está definido y es un array
        if (!Array.isArray(products)) {
            return res.status(400).json({ error: "El formato de 'products' debe ser un array." });
        }

        // 🔹 Verifica si `quantity` está llegando como número
        if (products.some(p => typeof p.quantity !== 'number' || p.quantity < 1)) {
            return res.status(400).json({ error: "La cantidad debe ser un número positivo." });
        }

        const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true }).populate("products.product");
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

        res.json(cart);
    } catch (error) {
        console.error("❌ Error en updateCart:", error); // 🛠️ LOG PARA VER EL ERROR DETALLADO
        res.status(500).json({ error: error.message });
    }
};


/**
 * Actualizar solo la cantidad de un producto en el carrito
 */
export const updateProductQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const parsedQuantity = Number(quantity);
        if (isNaN(parsedQuantity) || parsedQuantity < 1) {
            return res.status(400).json({ error: "La cantidad debe ser un número positivo." });
        }

        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex === -1) return res.status(404).json({ error: "Producto no encontrado en el carrito" });

        const product = await Product.findById(pid);
        const currentQuantity = cart.products[productIndex].quantity;

        if (parsedQuantity > currentQuantity) {
            // 🔥 **Restar stock si aumenta cantidad**
            const difference = parsedQuantity - currentQuantity;
            if (product.stock < difference) {
                return res.status(400).json({ message: "Stock insuficiente" });
            }
            product.stock -= difference;
        } else if (parsedQuantity < currentQuantity) {
            // 🔥 **Devolver stock si disminuye cantidad**
            product.stock += currentQuantity - parsedQuantity;
        }

        cart.products[productIndex].quantity = parsedQuantity;

        await product.save();
        await cart.save();

        res.json(cart);
    } catch (error) {
        console.error("❌ Error en updateProductQuantity:", error);
        res.status(500).json({ error: error.message });
    }
};



// ✅ VACIAR EL CARRITO COMPLETAMENTE
export const clearCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const io = req.app.get("io");

        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

        // ✅ **Devolver stock de todos los productos**
        for (let item of cart.products) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        // ✅ **Vaciar el carrito**
        cart.products = [];
        await cart.save();

        // 🔄 Emitir actualización en tiempo real
        io.emit("productosActualizados", await Product.find());
        io.emit("carritoActualizado", cart);

        res.json({ message: "Carrito vaciado correctamente", cart });
    } catch (error) {
        console.error("❌ Error al vaciar el carrito:", error);
        res.status(500).json({ message: "Error al vaciar el carrito.", error });
    }
};