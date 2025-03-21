import dotenv from "dotenv";
dotenv.config(); // 🔥 Asegura que las variables de entorno se carguen antes de usarlas
import express from "express";
import exphbs from "express-handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import Handlebars from "handlebars";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import Product from "./models/Product.js";
import connectDB from "./config/db.js"; // Conexión a MongoDB

// Conectar a MongoDB
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Handlebars con acceso a prototipos
const hbs = exphbs.create({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
});

const app = express();
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Configuración del puerto
const PORT = process.env.PORT || 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en: http://localhost:${PORT}`);
});


// 🔹 Configuración de WebSockets con Socket.io
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
app.set("io", io);

// ✅ Middleware para compartir `io` con los routers
app.use((req, res, next) => {
    req.io = io;
    next();
});

// ✅ WebSockets: solo una conexión por cliente
io.on("connection", async (socket) => {
    if (!socket.handshake.headers.referer?.includes("/products")) {
        return;
    }

    console.log("🟢 Cliente conectado en /products vía WebSockets");

    try {
        const productos = await Product.find();
        socket.emit("productosActualizados", productos);
    } catch (error) {
        console.error("❌ Error al obtener productos:", error);
    }

    socket.on("productosActualizados", async () => {
        try {
            const productos = await Product.find();
            io.emit("productosActualizados", productos);
        } catch (error) {
            console.error("❌ Error al actualizar productos:", error);
        }
    });

    // 🔹 No desconectar al cambiar de página dentro del sitio
    socket.on("disconnecting", () => {
        console.log("🔴 Cliente desconectando...");
    });
});

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);