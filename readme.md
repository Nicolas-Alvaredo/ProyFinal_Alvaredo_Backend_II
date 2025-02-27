# 2da Entrega Backend I - Gestión de Productos y Carritos

Este proyecto es una API desarrollada en **Node.js** y **Express** que permite gestionar productos y carritos de compras mediante diferentes endpoints. Además, se integra con **Handlebars** para la visualización y **WebSockets** para la actualización en tiempo real.

## 🚀 Características principales

### 📦 Productos

- **Crear productos**: Se pueden agregar productos con los siguientes campos:
  - `title`, `description`, `price`, `thumbnails`, `code`, `stock`, `category`, `status`.
- **Obtener productos**: Listar todos los productos o buscar por ID.
- **Actualizar productos**: Modificar cualquier campo excepto el `id`.
- **Eliminar productos**: Eliminar un producto existente.

### 🛍️ Carritos

- **Crear carritos**: Generar un carrito vacío con un `cid` único.
- **Obtener carritos**: Consultar un carrito por su `cid` y listar los productos que contiene.
- **Agregar productos**: Añadir productos al carrito. Si el producto ya existe, incrementa la cantidad (`quantity`).
- **Eliminar carritos**: Eliminar un carrito específico.

### 💾 Persistencia de datos

Los datos de productos y carritos se almacenan en archivos JSON (`products.json` y `carts.json`) utilizando el sistema de archivos de Node.js (**fs**).

## 🖥️ Integración con Handlebars

Se implementaron vistas dinámicas con **Handlebars**, permitiendo la visualización de productos en la interfaz:

- **`/` (Home)**: Muestra la lista de productos disponibles.
- **`/realtimeproducts`**: Muestra los productos en tiempo real mediante **WebSockets**.

## 🔌 Integración con WebSockets

Se configuró **Socket.io** para que las vistas de productos en tiempo real actualicen su contenido automáticamente cuando:

- Se agrega un nuevo producto.
- Se elimina un producto existente.

Cada cliente conectado recibe la actualización sin necesidad de recargar la página.

## 🛠️ Instalación

Clona este repositorio y ejecuta:

```bash
npm install
```

## 🛠️ Ejecución

```bash
   npm start
```
