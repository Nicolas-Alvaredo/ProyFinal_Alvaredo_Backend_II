document.addEventListener("DOMContentLoaded", () => {
    const socket = io(); // Conectar con WebSockets

    const form = document.getElementById("addProductForm");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const title = document.getElementById("title").value;
        const price = parseFloat(document.getElementById("price").value);

        if (title && price) {
            // Enviar nuevo producto a través de WebSockets
            socket.emit("nuevoProducto", { title, price });

            // Limpiar el formulario
            form.reset();
        }
    });
});
