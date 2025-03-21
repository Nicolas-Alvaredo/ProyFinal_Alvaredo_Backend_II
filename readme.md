# 🛒 Proyecto Final - Backend I - Gestión de Productos y Carritos

Este proyecto es una API desarrollada en **Node.js** y **Express** que permite gestionar productos y carritos de compras mediante diferentes endpoints. Se integra con **MongoDB** para la persistencia de datos, **Handlebars** para la visualización y **WebSockets** para la actualización en tiempo real.

## 🚀 Características principales

### 📦 Productos

- **Crear productos**: Se pueden agregar productos con los siguientes campos:
  - `title`, `description`, `price`, `thumbnails`, `code`, `stock`, `category`, `status`.
- **Obtener productos**: Listar todos los productos con paginación, filtros y ordenamientos por precio.
- **Buscar productos**: Filtrar por categoría o disponibilidad.
- **Actualizar productos**: Modificar cualquier campo excepto el `id`.
- **Eliminar productos**: Eliminar un producto existente.

### 🛍️ Carritos

- **Crear carritos**: Generar un carrito vacío con un `cid` único.
- **Obtener carritos**: Consultar un carrito por su `cid` y listar los productos que contiene.
- **Agregar productos**: Añadir productos al carrito. Si el producto ya existe, incrementa la cantidad (`quantity`).
- **Actualizar carritos**:
  - **PUT `/api/carts/:cid`**: Actualiza todos los productos del carrito.
  - **PUT `/api/carts/:cid/products/:pid`**: Modifica la cantidad de un producto dentro del carrito.
- **Eliminar productos del carrito**:
  - **DELETE `/api/carts/:cid/products/:pid`**: Elimina un producto específico del carrito.
  - **DELETE `/api/carts/:cid`**: Vacía completamente el carrito.

### 💾 Persistencia de datos

- Se implementó **MongoDB** con **Mongoose** para almacenar productos y carritos de manera eficiente.
- Se utiliza **populate()** en MongoDB para obtener detalles completos de los productos dentro de un carrito.

## 🖥️ Integración con Handlebars

Se implementaron vistas dinámicas con **Handlebars**, permitiendo la visualización de productos y carritos en la interfaz:

- **`/products`**: Muestra la lista de productos disponibles con paginación, filtros y ordenamiento.
- **`/products/:pid`**: Vista individual de un producto con detalles completos y opción de agregar al carrito.
- **`/carts/:cid`**: Muestra los productos de un carrito específico.

## 🔌 Integración con WebSockets

Se configuró **Socket.io** para que las vistas de productos y carritos en tiempo real actualicen su contenido automáticamente cuando:

- Se agrega un nuevo producto.
- Se elimina un producto existente.
- Se actualiza el stock de un producto.
- Se agrega o elimina un producto del carrito.

Cada cliente conectado recibe la actualización sin necesidad de recargar la página.

## ⚙️ Configuración del entorno

Debes crear un archivo `.env` en la raíz del proyecto basado en `env-example`, configurando la conexión con MongoDB:

```plaintext
MONGO_URI=mongodb+srv://tu_usuario:tu_password@tu_cluster.mongodb.net/tu_base_de_datos
PORT=8080
```

## 🛠️ Instalación y ejecución

### 📥 Clonar el repositorio

```bash
git clone https://github.com/tu_usuario/tu_repositorio.git
cd tu_repositorio
```

### 📦 Instalar dependencias

```bash
npm install
```

### ▶️ Ejecutar el servidor

```bash
npm start
```

El servidor estará disponible en: [http://localhost:8080](http://localhost:8080)

## 📡 Endpoints principales

### 📍 Productos

- `GET /api/products` → Lista de productos con paginación y filtros.
- `POST /api/products` → Crear un nuevo producto.
- `PUT /api/products/:pid` → Actualizar un producto.
- `DELETE /api/products/:pid` → Eliminar un producto.

### 📍 Carritos

- `POST /api/carts` → Crear un carrito vacío.
- `GET /api/carts/:cid` → Obtener un carrito con sus productos.
- `POST /api/carts/:cid/products/:pid` → Agregar un producto al carrito.
- `PUT /api/carts/:cid` → Actualizar productos del carrito.
- `PUT /api/carts/:cid/products/:pid` → Modificar la cantidad de un producto.
- `DELETE /api/carts/:cid/products/:pid` → Eliminar un producto del carrito.
- `DELETE /api/carts/:cid` → Vaciar completamente el carrito.

## 📝 Notas adicionales

- **No olvides configurar tu `.env` correctamente**.
- **Asegúrate de tener MongoDB Atlas o una instancia local en funcionamiento**.
- **Revisa los logs de consola para verificar la conexión a la base de datos**.

¡Listo! Ahora puedes gestionar productos y carritos con un backend escalable y eficiente. 🚀
