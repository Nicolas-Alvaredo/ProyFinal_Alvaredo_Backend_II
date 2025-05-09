import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true }, // Código único para evitar duplicados
    price: { type: Number, required: true, index: true },  // Index en el precio para ordenamiento
    stock: { type: Number, required: true, index: true }, // Index en stock para filtros
    category: { type: String, required: true, index: true }, // Index en categoría para búsquedas
    thumbnails: { type: [String], default: [] },
});

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);
export default Product;