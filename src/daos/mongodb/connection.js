import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // 🔥 Cargar variables de entorno

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error("❌ No se encontró MONGO_URI en el archivo .env");
        }

        await mongoose.connect(process.env.MONGO_URI);


        console.log("✅ Conectado a MongoDB");
    } catch (error) {
        console.error("❌ Error al conectar a MongoDB:", error.message);
        process.exit(1);
    }
};

export default connectDB;
