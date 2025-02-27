import express from "express";
import exphbs from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import createProductRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/productManager.js";
import CartManager from "./managers/cartManager.js";

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear instancias de los Managers con rutas de archivos JSON
const productManager = new ProductManager(path.join(__dirname, "data/products.json"));
const cartManager = new CartManager(path.join(__dirname, "data/carts.json"));

// Configuración del servidor
const app = express();
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
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

// Configuración de WebSockets con Socket.io
const io = new Server(httpServer);

// WebSockets solo registra conexiones (lógica movida a las rutas)
io.on("connection", (socket) => {
    console.log("Cliente conectado vía WebSockets");
});

// Rutas
app.use("/api/products", createProductRouter(io)); // Pasamos `io`
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

export { productManager, cartManager };
