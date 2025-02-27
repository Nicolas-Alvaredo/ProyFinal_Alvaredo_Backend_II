const socket = io();
const contenedorProductos = document.getElementById("contenedorProductos");
const productForm = document.getElementById("productForm");

productForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const producto = {
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        description: document.getElementById("description").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
    };

    try {
        const response = await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto),
        });

        if (!response.ok) {
            throw new Error("Error al agregar producto");
        }
    } catch (error) {
        console.error("Error:", error);
    }

    productForm.reset();
});

socket.on("productos", (productos) => {
    contenedorProductos.innerHTML = "";
    productos.forEach((producto) => {
        const div = document.createElement("div");
        div.classList.add("product-card");
        div.innerHTML = `
            <h2>${producto.title}</h2>
            <p><strong>Precio:</strong> $${producto.price}</p>
            <p><strong>Descripción:</strong> ${producto.description}</p>
            <p><strong>Código:</strong> ${producto.code}</p>
            <p><strong>Stock:</strong> ${producto.stock}</p>
            <p><strong>Categoría:</strong> ${producto.category}</p>
            <button onclick="eliminarProducto('${producto.id}')">Eliminar</button>
        `;
        contenedorProductos.appendChild(div);
    });
});

async function eliminarProducto(id) {
    try {
        const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
        if (!response.ok) {
            throw new Error("Error al eliminar producto");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
