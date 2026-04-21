// ==========================================
// 1. MODO OSCURO (Invencible contra el Sistema Operativo)
// ==========================================
const btnTheme = document.getElementById('btn-theme');
const prefiereOscuro = window.matchMedia("(prefers-color-scheme: dark)");
const temaGuardado = localStorage.getItem('theme');

// Cargar preferencia al iniciar
if (temaGuardado === 'dark') {
    document.body.classList.add('dark-theme');
} else if (temaGuardado === 'light') {
    document.body.classList.add('light-theme');
}

// Cambiar tema al dar clic
btnTheme.addEventListener('click', () => {
    let nuevoTema;
    
    if (document.body.classList.contains('dark-theme') || 
       (!document.body.classList.contains('light-theme') && prefiereOscuro.matches)) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        nuevoTema = 'light';
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        nuevoTema = 'dark';
    }
    localStorage.setItem('theme', nuevoTema);
});


// ==========================================
// 2. CARRUSEL DE IMÁGENES (Con seguro anti-errores)
// ==========================================
const slider = document.querySelector(".slider");

// SOLO ejecutamos la lógica del carrusel si el elemento existe en la página actual
if (slider) {
    const slides = document.querySelectorAll(".slide");
    let index = 0;

    function updateSlide() {
        slider.style.transform = `translateX(-${index * 100}%)`;
    }

    // Botones
    document.querySelector(".next").onclick = () => {
        index = (index + 1) % slides.length;
        updateSlide();
    };

    document.querySelector(".prev").onclick = () => {
        index = (index - 1 + slides.length) % slides.length;
        updateSlide();
    };

    // Rotación automática cada 4 segundos
    setInterval(() => {
        index = (index + 1) % slides.length;
        updateSlide();
    }, 4000);
}