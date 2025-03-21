import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, min: 1 } // 🔹 `min: 1` asegura que siempre sea positivo
        }
    ]
});

// Indexar la relación de productos para optimizar populate
cartSchema.index({ "products.product": 1 });


const Cart = mongoose.model('Cart', cartSchema);
export default Cart;

