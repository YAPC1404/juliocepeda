# Julio Cepeda Jugueterías

Sitio web prototipo de una tienda de juguetes mexicana, desarrollado con HTML, CSS y JavaScript puro (sin frameworks ni dependencias).

## Características

- **Catálogo de productos** con vista de lista y detalle individual
- **Carrito de compras funcional** con persistencia en `localStorage`
- **Checkout** con resumen dinámico del carrito
- **Dashboard de usuario** con pedidos recientes, configuración, direcciones y métodos de pago
- **Modo claro/oscuro** que respeta la preferencia del sistema y se puede alternar manualmente
- **Onboarding interactivo** la primera vez que el usuario entra al sitio (tour guiado de 5 pasos)
- **Personalización del tamaño de letra** (pequeño / normal / grande)
- **Carrusel de imágenes** en la página principal con rotación automática y controles manuales
- **Diseño responsivo mobile-first** con breakpoints para tablet y escritorio
- **Microinteracciones**: toast de confirmación al agregar productos, badge animado en el carrito, transiciones suaves
- **Accesibilidad**: etiquetas `aria-label`, atributos `alt` descriptivos, navegación por teclado con indicador visual de foco, breadcrumbs

## Estructura del proyecto

```
juliocepeda-main/
├── index.html                  Página principal
├── product-list.html           Catálogo
├── product-detail.html         Detalle de producto (bicicleta)
├── product-detail-lego.html    Detalle de producto (Lego)
├── cart.html                   Carrito de compras
├── checkout.html               Página de pago
├── dashboard.html              Mi cuenta
├── css/
│   ├── styles.css              Variables de tema y reset universal
│   ├── components.css          Header, footer, breadcrumbs, toast, onboarding
│   ├── index.css               Banner y categorías del home
│   ├── catalogo.css            Grid de productos
│   ├── product-detail.css      Vista de detalle
│   ├── cart.css                Carrito
│   ├── checkout.css            Pago
│   └── dashboard.css           Mi cuenta
├── js/
│   └── main.js                 Lógica de tema, carrusel, carrito, onboarding y fuente
└── img/                        Imágenes del sitio
```

## Cómo ejecutar el proyecto

No requiere build ni instalación. Puedes abrir `index.html` directamente en el navegador, o servir el directorio como sitio estático (recomendado para que rutas relativas y `localStorage` funcionen correctamente):

```powershell
python -m http.server 8000
```

Luego abre `http://localhost:8000` en tu navegador.

## Tecnologías

- HTML5 semántico
- CSS3 con variables personalizadas, Grid y Flexbox
- JavaScript ES6 vanilla
- `localStorage` para persistir tema, carrito, preferencia de fuente y estado del onboarding

## Persistencia (claves en localStorage)

| Clave | Propósito |
|---|---|
| `theme` | `dark` o `light` |
| `font-size` | `small`, `normal` o `large` |
| `jc-cart` | Array JSON con los productos del carrito |
| `onboarding-completed` | `true` si el usuario ya vio el tutorial |

## Accesibilidad

- Compatible con lectores de pantalla mediante `aria-label` y `aria-live`
- Navegación completa por teclado con `:focus-visible` resaltado
- Colores con contraste suficiente para personas con debilidad visual
- Etiquetas `alt` descriptivas en todas las imágenes

## Autor

Yael Palomo Cárdenas 1927500
Diego Roman
