import dotenv from "dotenv";
dotenv.config(); // Asegura que las variables de entorno se carguen antes de usarlas
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
import productsApiRouter from "./routes/api/products.api.router.js";
import cartsApiRouter from "./routes/api/carts.api.router.js";
import Product from "./daos/mongodb/models/product-model.js";
import connectDB from "./daos/mongodb/mongo-dao.js"; // Conexión a MongoDB
import sessionsRouter from './routes/sessions.router.js';
import passport from './middlewares/passport-jwt.middleware.js';
import cookieParser from "cookie-parser";


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
app.use(cookieParser());
app.use(passport.initialize());


app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use('/api/sessions', sessionsRouter);


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

// 🔐 Rutas protegidas (JWT + roles)
app.use("/api/products", productsApiRouter);
app.use("/api/carts", cartsApiRouter);
app.use("/api/sessions", sessionsRouter);

// 🖼️ Rutas de vistas públicas
app.use("/", viewsRouter);  
app.use("/products", productsRouter);
app.use("/carts", cartsRouter);
