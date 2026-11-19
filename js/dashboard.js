document.addEventListener("DOMContentLoaded", () => {
    const kpiTotal = document.getElementById("kpi-total");
    if (!kpiTotal) return;

    const ahora = new Date();
    document.getElementById("fecha-actualizacion").textContent =
        "Ultima actualizacion: " + ahora.toLocaleDateString() + " " + ahora.toLocaleTimeString();

    fetch("data/productos.json")
        .then(res => res.json())
        .then(productos => {
            const totalProductos = productos.length;
            const categoriasUnicas = [...new Set(productos.map(p => p.categoria))];
            const valorInventario = productos.reduce((acc, p) => acc + (p.precio * p.stock), 0);
            const disponibles = productos.filter(p => p.stock > 0).length;
            const agotados = productos.filter(p => p.stock === 0).length;
            const bajoStockLista = productos.filter(p => p.stock > 0 && p.stock < 5);

            document.getElementById("kpi-total").textContent = totalProductos;
            document.getElementById("kpi-categorias").textContent = categoriasUnicas.length;
            document.getElementById("kpi-valor").textContent = valorInventario.toLocaleString() + " Bs";
            document.getElementById("kpi-disponibles").textContent = disponibles;
            document.getElementById("kpi-agotados").textContent = agotados;
            document.getElementById("kpi-bajo-stock").textContent = bajoStockLista.length;

            const tbody = document.getElementById("tabla-bajo-stock");
            tbody.innerHTML = "";
            bajoStockLista.forEach(p => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${p.id}</td>
                    <td>${p.nombre}</td>
                    <td>${p.categoria}</td>
                    <td>${p.precio} Bs</td>
                    <td style="color:#dc2626; font-weight:bold;">${p.stock} unid.</td>
                `;
                tbody.appendChild(tr);
            });

            const conteoCategorias = categoriasUnicas.map(cat =>
                productos.filter(p => p.categoria === cat).length
            );

            new Chart(document.getElementById("grafico-categorias"), {
                type: "bar",
                data: {
                    labels: categoriasUnicas,
                    datasets: [{
                        label: "Cantidad de Productos",
                        data: conteoCategorias,
                        backgroundColor: ["#1e3a8a", "#2563eb", "#f59e0b", "#16a34a"]
                    }]
                },
                options: { responsive: true }
            });

            new Chart(document.getElementById("grafico-stock"), {
                type: "doughnut",
                data: {
                    labels: ["Stock Normal (>=5)", "Bajo Stock (1-4)", "Agotados (0)"],
                    datasets: [{
                        data: [
                            productos.filter(p => p.stock >= 5).length,
                            bajoStockLista.length,
                            agotados
                        ],
                        backgroundColor: ["#16a34a", "#f59e0b", "#dc2626"]
                    }]
                },
                options: { responsive: true }
            });
        })
        .catch(err => console.error("Error cargando dashboard:", err));
});
