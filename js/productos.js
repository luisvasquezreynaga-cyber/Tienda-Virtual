let todosLosProductos = [];

document.addEventListener("DOMContentLoaded", () => {
    const lista = document.getElementById("lista-productos");
    if (!lista) return;

    const buscador = document.getElementById("buscador");
    const filtroCategoria = document.getElementById("filtro-categoria");
    const filtroStock = document.getElementById("filtro-stock");
    const ordenPrecio = document.getElementById("orden-precio");

    const params = new URLSearchParams(window.location.search);
    const catUrl = params.get("categoria");
    if (catUrl) {
        filtroCategoria.value = catUrl;
    }

    fetch("data/productos.json")
        .then(res => res.json())
        .then(data => {
            todosLosProductos = data;
            aplicarFiltros();
        })
        .catch(err => console.error("Error cargando productos:", err));

    buscador.addEventListener("input", aplicarFiltros);
    filtroCategoria.addEventListener("change", aplicarFiltros);
    filtroStock.addEventListener("change", aplicarFiltros);
    ordenPrecio.addEventListener("change", aplicarFiltros);

    const modal = document.getElementById("modal-detalle");
    const cerrarModal = document.getElementById("cerrar-modal");
    cerrarModal.addEventListener("click", () => modal.classList.add("oculto"));
    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("oculto");
    });
});

function aplicarFiltros() {
    const texto = document.getElementById("buscador").value.toLowerCase();
    const categoria = document.getElementById("filtro-categoria").value;
    const stock = document.getElementById("filtro-stock").value;
    const orden = document.getElementById("orden-precio").value;

    let filtrados = todosLosProductos.filter(p => {
        const coincideNombre = p.nombre.toLowerCase().includes(texto);
        const coincideCat = categoria === "todas" || p.categoria === categoria;
        const coincideStock = stock === "todos" ||
            (stock === "disponible" && p.stock > 0) ||
            (stock === "agotado" && p.stock === 0);
        return coincideNombre && coincideCat && coincideStock;
    });

    if (orden === "menor-mayor") {
        filtrados.sort((a, b) => a.precio - b.precio);
    } else if (orden === "mayor-menor") {
        filtrados.sort((a, b) => b.precio - a.precio);
    }

    renderizarProductos(filtrados);
}

function renderizarProductos(productos) {
    const lista = document.getElementById("lista-productos");
    lista.innerHTML = "";

    if (productos.length === 0) {
        lista.innerHTML = "<p>No se encontraron productos con esos filtros.</p>";
        return;
    }

    productos.forEach(prod => {
        const card = document.createElement("div");
        card.className = "card-producto";
        card.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}">
            <div class="card-body">
                <span class="badge-categoria">${prod.categoria}</span>
                <h3>${prod.nombre}</h3>
                <p class="card-desc">${prod.descripcion}</p>
                <p class="precio">${prod.precio} Bs</p>
                <p class="${prod.stock > 0 ? 'stock-disponible' : 'stock-agotado'}">
                    ${prod.stock > 0 ? 'Stock: ' + prod.stock + ' disponibles' : 'Agotado'}
                </p>
                <div class="card-acciones">
                    <button class="btn-detalle" onclick="verDetalle(${prod.id})">Ver Detalle</button>
                    <button class="btn-agregar" onclick="agregarAlCarrito(${prod.id})" ${prod.stock === 0 ? 'disabled' : ''}>
                        Agregar
                    </button>
                </div>
            </div>
        `;
        lista.appendChild(card);
    });
}

function verDetalle(id) {
    const prod = todosLosProductos.find(p => p.id === id);
    if (!prod) return;

    const contenido = document.getElementById("contenido-modal");
    contenido.innerHTML = `
        <img src="${prod.imagen}" alt="${prod.nombre}" style="width:100%; border-radius:8px; margin-bottom:1rem;">
        <span class="badge-categoria">${prod.categoria}</span>
        <h2>${prod.nombre}</h2>
        <p style="margin:0.8rem 0;">${prod.descripcion}</p>
        <p class="precio">${prod.precio} Bs</p>
        <p class="${prod.stock > 0 ? 'stock-disponible' : 'stock-agotado'}">
            ${prod.stock > 0 ? 'En stock: ' + prod.stock + ' unidades' : 'Producto agotado'}
        </p>
    `;
    document.getElementById("modal-detalle").classList.remove("oculto");
}
