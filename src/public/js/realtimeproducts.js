const socket = io({ transports: ["websocket"] }); // ✅ Evita conexiones duplicadas
const contenedorProductos = document.getElementById("contenedorProductos");

// ✅ 🔄 **Actualizar solo el stock del producto modificado**
socket.on("productosActualizados", (productoActualizado) => {
    console.log("🔄 Stock actualizado en tiempo real:", productoActualizado);

    // 📌 Actualizar solo el stock del producto afectado sin recargar toda la UI
    if (Array.isArray(productoActualizado)) {
        productoActualizado.forEach((prod) => {
            const stockElement = document.getElementById(`stock-${prod._id}`);
            if (stockElement) {
                stockElement.textContent = prod.stock;
            }
        });
    } else {
        const stockElement = document.getElementById(`stock-${productoActualizado._id}`);
        if (stockElement) {
            stockElement.textContent = productoActualizado.stock;
        }
    }
});