const btnTheme = document.getElementById('btn-theme');
const prefiereOscuro = window.matchMedia("(prefers-color-scheme: dark)");
const temaGuardado = localStorage.getItem('theme');

if (temaGuardado === 'dark') {
    document.body.classList.add('dark-theme');
} else if (temaGuardado === 'light') {
    document.body.classList.add('light-theme');
}

if (btnTheme) {
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
}

const slider = document.querySelector(".slider");
if (slider) {
    const slides = document.querySelectorAll(".slide");
    let index = 0;
    function updateSlide() {
        slider.style.transform = `translateX(-${index * 100}%)`;
    }
    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");
    if (nextBtn) nextBtn.onclick = () => { index = (index + 1) % slides.length; updateSlide(); };
    if (prevBtn) prevBtn.onclick = () => { index = (index - 1 + slides.length) % slides.length; updateSlide(); };
    setInterval(() => { index = (index + 1) % slides.length; updateSlide(); }, 4000);
}

const FONT_KEY = 'font-size';
const FONT_SIZES = { small: '14px', normal: '16px', large: '19px' };
function aplicarTamanoFuente(tam) {
    document.documentElement.style.fontSize = FONT_SIZES[tam] || FONT_SIZES.normal;
    localStorage.setItem(FONT_KEY, tam);
    document.querySelectorAll('[data-font-btn]').forEach(b => {
        b.classList.toggle('font-activo', b.dataset.fontBtn === tam);
    });
}
aplicarTamanoFuente(localStorage.getItem(FONT_KEY) || 'normal');
document.querySelectorAll('[data-font-btn]').forEach(btn => {
    btn.addEventListener('click', () => aplicarTamanoFuente(btn.dataset.fontBtn));
});

const CART_KEY = 'jc-cart';
function leerCarrito() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
}
function guardarCarrito(c) {
    localStorage.setItem(CART_KEY, JSON.stringify(c));
    actualizarBadgeCarrito();
}
function agregarAlCarrito(producto) {
    const carrito = leerCarrito();
    const existente = carrito.find(p => p.id === producto.id);
    if (existente) existente.cantidad += producto.cantidad || 1;
    else carrito.push({ ...producto, cantidad: producto.cantidad || 1 });
    guardarCarrito(carrito);
}
function actualizarBadgeCarrito(animar) {
    const total = leerCarrito().reduce((s, p) => s + p.cantidad, 0);
    document.querySelectorAll('.cart-badge').forEach(el => {
        const previo = parseInt(el.textContent, 10) || 0;
        el.textContent = total;
        el.style.display = total > 0 ? 'inline-flex' : 'none';
        if (animar && total !== previo && total > 0) {
            el.classList.remove('badge-bump');
            void el.offsetWidth;
            el.classList.add('badge-bump');
        }
    });
}
actualizarBadgeCarrito();

function mostrarToast(mensaje) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="toast-icon">✅</span><span>${mensaje}</span>`;
    toast.classList.add('toast-visible');
    clearTimeout(mostrarToast._t);
    mostrarToast._t = setTimeout(() => toast.classList.remove('toast-visible'), 2400);
}

function volarAlCarrito(imgSrc, origenRect) {
    const destino = document.querySelector('.cart-link');
    if (!destino || !origenRect) return;
    const destRect = destino.getBoundingClientRect();
    const clon = document.createElement('img');
    clon.src = imgSrc;
    clon.className = 'fly-clone';
    clon.style.left = origenRect.left + 'px';
    clon.style.top = origenRect.top + 'px';
    clon.style.width = origenRect.width + 'px';
    clon.style.height = origenRect.height + 'px';
    document.body.appendChild(clon);
    requestAnimationFrame(() => {
        const dx = destRect.left + destRect.width / 2 - (origenRect.left + origenRect.width / 2);
        const dy = destRect.top + destRect.height / 2 - (origenRect.top + origenRect.height / 2);
        clon.style.transform = `translate(${dx}px, ${dy}px) scale(0.15) rotate(360deg)`;
        clon.style.opacity = '0.2';
    });
    setTimeout(() => clon.remove(), 850);
}

document.querySelectorAll('[data-add-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.dataset.addCart;
        const nombre = btn.dataset.nombre || 'Producto';
        const precio = parseFloat(btn.dataset.precio || '0');
        const img = btn.dataset.img || '';
        const cantSel = document.getElementById('cantidad');
        const cantidad = cantSel ? parseInt(cantSel.value, 10) : 1;

        const card = btn.closest('article') || btn.closest('.detalle-grid');
        const imgEl = card ? card.querySelector('img') : null;
        if (imgEl && img) volarAlCarrito(img, imgEl.getBoundingClientRect());

        agregarAlCarrito({ id, nombre, precio, img, cantidad });
        actualizarBadgeCarrito(true);
        mostrarToast(`${nombre} agregado al carrito`);
    });
});

function crearRipple(e) {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top  = (e.clientY - rect.top  - size / 2) + 'px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

document.querySelectorAll('.btn-primario, .btn-comprar').forEach(btn => {
    btn.addEventListener('click', crearRipple);
});

const header = document.querySelector('.header');
if (header) {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.scrollY > 30) header.classList.add('header-compacto');
                else header.classList.remove('header-compacto');
                ticking = false;
            });
            ticking = true;
        }
    });
}

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.tarjeta-producto, .reveal, .category, .pedido, .direccion-card, .tarjeta-card').forEach((el, i) => {
    if (!el.classList.contains('tarjeta-producto') && !el.classList.contains('reveal')) {
        el.classList.add('reveal');
    }
    el.style.transitionDelay = (i * 0.07) + 's';
    revealObserver.observe(el);
});

document.querySelectorAll('[data-remove-cart]').forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.dataset.removeCart;
        const carrito = leerCarrito().filter(p => p.id !== id);
        guardarCarrito(carrito);
        renderCarrito();
        mostrarToast('Producto eliminado');
    });
});

function formatoMXN(n) {
    return '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderCarrito() {
    const cont = document.getElementById('carrito-items');
    const resumen = document.getElementById('carrito-resumen');
    if (!cont) return;
    const carrito = leerCarrito();
    if (carrito.length === 0) {
        cont.innerHTML = `<p class="carrito-vacio">Tu carrito está vacío. <a href="product-list.html">Ver juguetes</a></p>`;
        if (resumen) resumen.style.display = 'none';
        return;
    }
    if (resumen) resumen.style.display = '';
    cont.innerHTML = carrito.map(p => `
        <article class="item-carrito">
            <img src="${p.img}" alt="${p.nombre}" class="item-img">
            <div class="item-detalles">
                <h3>${p.nombre}</h3>
                <p class="item-precio">${formatoMXN(p.precio)}</p>
                <div class="item-controles">
                    <label for="cant-${p.id}">Cant:</label>
                    <input type="number" id="cant-${p.id}" value="${p.cantidad}" min="1" class="input-cantidad" data-cant="${p.id}">
                    <button class="btn-eliminar" data-remove-cart="${p.id}" aria-label="Eliminar ${p.nombre} del carrito">🗑️ Eliminar</button>
                </div>
            </div>
        </article>`).join('');

    const subtotal = carrito.reduce((s, p) => s + p.precio * p.cantidad, 0);
    const subEl = document.getElementById('resumen-subtotal');
    const totEl = document.getElementById('resumen-total');
    if (subEl) subEl.textContent = formatoMXN(subtotal);
    if (totEl) totEl.textContent = formatoMXN(subtotal);

    cont.querySelectorAll('[data-cant]').forEach(input => {
        input.addEventListener('change', () => {
            const id = input.dataset.cant;
            const carrito2 = leerCarrito();
            const item = carrito2.find(p => p.id === id);
            if (item) {
                item.cantidad = Math.max(1, parseInt(input.value, 10) || 1);
                guardarCarrito(carrito2);
                renderCarrito();
            }
        });
    });
    cont.querySelectorAll('[data-remove-cart]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.removeCart;
            const carrito2 = leerCarrito().filter(p => p.id !== id);
            guardarCarrito(carrito2);
            renderCarrito();
            mostrarToast('Producto eliminado');
        });
    });
}
renderCarrito();

const checkoutResumen = document.getElementById('checkout-resumen');
if (checkoutResumen) {
    const carrito = leerCarrito();
    if (carrito.length === 0) {
        checkoutResumen.innerHTML = `<p>No hay productos en el carrito. <a href="product-list.html">Ver juguetes</a></p>`;
    } else {
        const items = carrito.map(p => `
            <div class="item">
                <p>${p.nombre} x${p.cantidad}</p>
                <span>${formatoMXN(p.precio * p.cantidad)}</span>
            </div>`).join('');
        const total = carrito.reduce((s, p) => s + p.precio * p.cantidad, 0);
        checkoutResumen.innerHTML = items + `<hr><div class="total"><p>Total</p><span>${formatoMXN(total)}</span></div>`;
    }
}

const btnComprar = document.querySelector('.btn-comprar');
if (btnComprar) {
    btnComprar.addEventListener('click', (e) => {
        e.preventDefault();
        guardarCarrito([]);
        mostrarToast('¡Compra realizada con éxito!');
        setTimeout(() => window.location.href = 'dashboard.html', 1200);
    });
}

const ONBOARDING_KEY = 'onboarding-completed';
const ONBOARDING_STEPS = [
    { sel: '.logo', titulo: '¡Bienvenido a Julio Cepeda!', texto: 'Haz clic en el logo en cualquier momento para volver al inicio.' },
    { sel: '.search', titulo: 'Busca tus juguetes', texto: 'Usa la barra de búsqueda para encontrar lo que buscas.' },
    { sel: '#btn-theme', titulo: 'Modo claro u oscuro', texto: 'Cambia entre modo claro y oscuro según tu preferencia.' },
    { sel: '.font-controls', titulo: 'Tamaño de letra', texto: 'Ajusta el tamaño de la letra para leer más cómodamente.' },
    { sel: '.cart-link', titulo: 'Tu carrito', texto: 'Aquí verás los productos que vas agregando. ¡Disfruta la experiencia!' }
];

function iniciarOnboarding() {
    if (localStorage.getItem(ONBOARDING_KEY) === 'true') return;
    let paso = 0;
    const overlay = document.createElement('div');
    overlay.className = 'onboarding-overlay';
    overlay.innerHTML = `
        <div class="onboarding-card" role="dialog" aria-labelledby="ob-titulo">
            <h3 id="ob-titulo"></h3>
            <p id="ob-texto"></p>
            <div class="onboarding-pasos"></div>
            <div class="onboarding-acciones">
                <button type="button" class="onboarding-skip">Saltar</button>
                <button type="button" class="btn-primario onboarding-next">Siguiente</button>
            </div>
        </div>`;
    document.body.appendChild(overlay);

    const titulo = overlay.querySelector('#ob-titulo');
    const texto = overlay.querySelector('#ob-texto');
    const next = overlay.querySelector('.onboarding-next');
    const skip = overlay.querySelector('.onboarding-skip');
    const pasos = overlay.querySelector('.onboarding-pasos');

    function pintarPasos() {
        pasos.innerHTML = ONBOARDING_STEPS.map((_, i) => `<span class="${i === paso ? 'activo' : ''}"></span>`).join('');
    }

    function quitarResaltado() {
        document.querySelectorAll('.onboarding-resaltado').forEach(el => el.classList.remove('onboarding-resaltado'));
    }

    function mostrarPaso() {
        quitarResaltado();
        const step = ONBOARDING_STEPS[paso];
        const target = document.querySelector(step.sel);
        if (target) target.classList.add('onboarding-resaltado');
        titulo.textContent = step.titulo;
        texto.textContent = step.texto;
        next.textContent = paso === ONBOARDING_STEPS.length - 1 ? 'Listo' : 'Siguiente';
        pintarPasos();
    }

    function finalizar() {
        quitarResaltado();
        localStorage.setItem(ONBOARDING_KEY, 'true');
        overlay.remove();
    }

    next.addEventListener('click', () => {
        paso++;
        if (paso >= ONBOARDING_STEPS.length) finalizar();
        else mostrarPaso();
    });
    skip.addEventListener('click', finalizar);
    mostrarPaso();
}

window.addEventListener('load', () => setTimeout(iniciarOnboarding, 500));

const btnReiniciarTour = document.getElementById('btn-reiniciar-tour');
if (btnReiniciarTour) {
    btnReiniciarTour.addEventListener('click', () => {
        localStorage.removeItem(ONBOARDING_KEY);
        iniciarOnboarding();
    });
}

const btnLimpiarCarrito = document.getElementById('btn-limpiar-carrito');
if (btnLimpiarCarrito) {
    btnLimpiarCarrito.addEventListener('click', () => {
        guardarCarrito([]);
        renderCarrito();
        mostrarToast('Carrito vaciado');
    });
}
