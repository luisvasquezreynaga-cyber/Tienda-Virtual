let carrito = JSON.parse(localStorage.getItem("carritoTechBolivia")) || [];
let catalogoCache = [];

document.addEventListener("DOMContentLoaded", () => {
    actualizarContador();

    fetch("data/productos.json")
        .then(res => res.json())
        .then(data => {
            catalogoCache = data;
            if (document.getElementById("contenedor-carrito")) {
                renderizarCarrito();
            }
        });

    const btnVaciar = document.getElementById("vaciar-carrito");
    if (btnVaciar) {
        btnVaciar.addEventListener("click", () => {
            carrito = [];
            guardarCarrito();
            renderizarCarrito();
        });
    }

    const btnFinalizar = document.getElementById("finalizar-compra");
    if (btnFinalizar) {
        btnFinalizar.addEventListener("click", () => {
            if (carrito.length === 0) {
                alert("Tu carrito esta vacio.");
                return;
            }
            alert("Compra simulada realizada con exito. Gracias por comprar en TechBolivia Store.");
            carrito = [];
            guardarCarrito();
            renderizarCarrito();
        });
    }
});

function agregarAlCarrito(id) {
    const producto = catalogoCache.find(p => p.id === id);
    if (!producto || producto.stock === 0) return;

    const itemExistente = carrito.find(item => item.id === id);
    if (itemExistente) {
        if (itemExistente.cantidad < producto.stock) {
            itemExistente.cantidad++;
        } else {
            alert("No hay mas stock disponible de este producto.");
            return;
        }
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1
        });
    }

    guardarCarrito();
    alert("Producto agregado al carrito.");
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    renderizarCarrito();
}

function guardarCarrito() {
    localStorage.setItem("carritoTechBolivia", JSON.stringify(carrito));
    actualizarContador();
}

function actualizarContador() {
    const contador = document.getElementById("contador-carrito");
    if (contador) {
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        contador.textContent = totalItems;
    }
}

function renderizarCarrito() {
    const contenedor = document.getElementById("contenedor-carrito");
    const totalEl = document.getElementById("total-carrito");
    if (!contenedor) return;

    contenedor.innerHTML = "";
    let total = 0;

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>No tienes productos en tu carrito.</p>";
        totalEl.textContent = "0.00";
        return;
    }

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        const div = document.createElement("div");
        div.className = "item-carrito";
        div.innerHTML = `
            <div>
                <strong>${item.nombre}</strong>
                <p>Precio: ${item.precio} Bs x ${item.cantidad} unid.</p>
            </div>
            <div>
                <strong>Subtotal: ${subtotal.toFixed(2)} Bs</strong>
                <button class="btn-detalle" style="margin-left:10px; background:#dc2626; color:#fff;" onclick="eliminarDelCarrito(${item.id})">Quitar</button>
            </div>
        `;
        contenedor.appendChild(div);
    });

    totalEl.textContent = total.toFixed(2);
}