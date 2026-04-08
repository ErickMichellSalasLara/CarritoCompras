const URL_PRODUCTOS = "http://localhost:3000/productos";
const URL_CARRITO = "http://localhost:3000/carrito";
const contenedor = document.getElementById("contenedor-productos");

function crearCardProducto(producto) {
  return `
    <article class="producto-card">
      <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-img">
      <div class="producto-info">
        <p class="producto-categoria">Producto</p>
        <h3 class="producto-nombre">${producto.nombre}</h3>
        <p class="producto-descripcion">${producto.descripcion}</p>
        <p class="producto-precio">$${producto.precio}</p>
        <p class="producto-stock">Stock: ${producto.stock}</p>
        <button class="btn btn-primary" data-id="${producto.id}">Agregar al carrito</button>
      </div>
    </article>
  `;
}

async function agregarAlCarrito(idProducto) {
  try {
    const respuestaProductos = await fetch(URL_PRODUCTOS);
    const productos = await respuestaProductos.json();
    const producto = productos.find(p => String(p.id) === String(idProducto));

    if (!producto) {
      alert("Producto no encontrado");
      return;
    }

    const respuestaCarrito = await fetch(URL_CARRITO);
    const carrito = await respuestaCarrito.json();
    const productoEnCarrito = carrito.find(p => String(p.id) === String(idProducto));

    if (productoEnCarrito) {
      await fetch(`${URL_CARRITO}/${idProducto}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productoEnCarrito,
          cantidad: productoEnCarrito.cantidad + 1
        })
      });
    } else {
      await fetch(URL_CARRITO, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...producto,
          cantidad: 1
        })
      });
    }

    alert("Producto agregado al carrito");
  } catch (error) {
    console.error(error);
    alert("No se pudo agregar al carrito");
  }
}

async function cargarProductos() {
  try {
    const respuesta = await fetch(URL_PRODUCTOS);
    if (!respuesta.ok) throw new Error("No se pudieron obtener los productos");

    const productos = await respuesta.json();
    contenedor.innerHTML = "";

    productos.forEach(producto => {
      contenedor.innerHTML += crearCardProducto(producto);
    });

    const botones = document.querySelectorAll(".btn[data-id]");
    botones.forEach(boton => {
      boton.addEventListener("click", () => {
        agregarAlCarrito(boton.dataset.id);
      });
    });
  } catch (error) {
    contenedor.innerHTML = `<p>Error al cargar productos.</p>`;
    console.error(error);
  }
}

cargarProductos();