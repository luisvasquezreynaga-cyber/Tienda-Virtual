document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-contacto");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const celular = document.getElementById("celular").value.trim();
        const asunto = document.getElementById("asunto").value.trim();
        const mensaje = document.getElementById("mensaje").value.trim();
        const estado = document.getElementById("mensaje-estado");

        estado.classList.remove("oculto", "mensaje-exito", "mensaje-error");

        if (!nombre || !correo || !celular || !asunto || !mensaje) {
            estado.textContent = "Por favor, completa todos los campos obligatorios.";
            estado.classList.add("mensaje-error");
            return;
        }

        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexCorreo.test(correo)) {
            estado.textContent = "Ingresa un correo electronico valido.";
            estado.classList.add("mensaje-error");
            return;
        }

        if (celular.length < 7 || isNaN(celular)) {
            estado.textContent = "Ingresa un numero de celular valido (solo numeros).";
            estado.classList.add("mensaje-error");
            return;
        }

        estado.textContent = "Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.";
        estado.classList.add("mensaje-exito");
        form.reset();
    });
});
