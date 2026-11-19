document.addEventListener("DOMContentLoaded", () => {
    const contenedorDestacados = document.getElementById("productos-destacados");
    if (!contenedorDestacados) return;

    fetch("data/productos.json")
        .then(res => res.json())
        .then(productos => {
            const destacados = productos.filter(p => p.destacado);
            destacados.forEach(prod => {
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
                            ${prod.stock > 0 ? 'Disponible: ' + prod.stock + ' unid.' : 'Agotado'}
                        </p>
                        <div class="card-acciones">
                            <button class="btn-agregar" onclick="agregarAlCarrito(${prod.id})" ${prod.stock === 0 ? 'disabled' : ''}>
                                Agregar al Carrito
                            </button>
                        </div>
                    </div>
                `;
                contenedorDestacados.appendChild(card);
            });
        })
        .catch(err => console.error("Error cargando destacados:", err));
});
