// ==============================
// CONFIGURACIÓN GENERAL
// ==============================
const API_URL = '../api/productos.php';
const UPLOAD_URL = '../api/upload.php';


// ==============================
// CARGA INICIAL
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();

  // Manejar envío del formulario
  document.getElementById('formProducto').addEventListener('submit', e => {
    e.preventDefault();
    guardarProducto();
  });

  // Previsualizar imágenes al seleccionar
  document.getElementById('imagenes').addEventListener('change', mostrarPrevisualizaciones);
});

// ==============================
// FUNCIÓN PRINCIPAL: GUARDAR PRODUCTO
// ==============================
async function guardarProducto() {
  const id = document.getElementById('id').value;
  const form = document.getElementById('formProducto');

  // 1️⃣ Subir imágenes (si hay nuevas seleccionadas)
  const archivos = document.getElementById('imagenes').files;
  let nombresImagenes = [];

  if (archivos.length > 0) {
    const formData = new FormData();
    for (let i = 0; i < archivos.length; i++) {
      formData.append('imagenes[]', archivos[i]);
    }

    try {
      const res = await fetch(UPLOAD_URL, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        nombresImagenes = data.files; // array de nombres de archivos
      } else {
        alert('Error al subir imágenes: ' + data.error);
        return;
      }
    } catch (error) {
      console.error('Error al subir imágenes:', error);
      alert('Error en la subida de imágenes.');
      return;
    }
  }

  // 2️⃣ Crear objeto con datos del producto
  const producto = {
    categoria: document.getElementById('categoria').value,
    clasificacion: document.getElementById('clasificacion').value,
    carroceria: document.getElementById('carroceria').value,
    proveedor: document.getElementById('proveedor').value,
    uso: document.getElementById('uso').value,
    nombre: document.getElementById('nombre').value,
    codigo: document.getElementById('codigo').value,
    precio: document.getElementById('precio').value,
    stock: document.getElementById('stock').value,
    descripcion: document.getElementById('descripcion').value,
    imagenes: nombresImagenes
  };

  // 3️⃣ Enviar al backend
  const metodo = id ? 'PUT' : 'POST';
  const url = id ? `${API_URL}?id=${id}` : API_URL;

  try {
    const res = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto)
    });

    if (res.ok) {
      alert(id ? 'Producto actualizado correctamente' : 'Producto agregado correctamente');
      limpiarFormulario();
      cargarProductos();
    } else {
      alert('Error al guardar producto.');
    }
  } catch (error) {
    console.error('Error al guardar producto:', error);
  }
}

// ==============================
// CARGAR PRODUCTOS EN TABLA
// ==============================
async function cargarProductos() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const tbody = document.getElementById('tablaProductos');
    tbody.innerHTML = '';

    data.forEach(p => {
      const fila = document.createElement('tr');
      const imagenesHTML = p.imagenes
        ? p.imagenes.map(img => `<img src="images/${img}" alt="foto" width="50">`).join(' ')
        : '';

      fila.innerHTML = `
        <td>${p.id}</td>
        <td>${p.categoria}</td>
        <td>${p.nombre}</td>
        <td>$${p.precio || '-'}</td>
        <td>${p.stock || '-'}</td>
        <td>${imagenesHTML}</td>
        <td>
          <button class="btn-editar" onclick='editarProducto(${JSON.stringify(p)})'>✏️</button>
          <button class="btn-eliminar" onclick="eliminarProducto(${p.id})">🗑️</button>
        </td>
      `;
      tbody.appendChild(fila);
    });
  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
}

// ==============================
// EDITAR PRODUCTO
// ==============================
function editarProducto(producto) {
  document.getElementById('id').value = producto.id;
  document.getElementById('categoria').value = producto.categoria;
  document.getElementById('clasificacion').value = producto.clasificacion;
  document.getElementById('carroceria').value = producto.carroceria;
  document.getElementById('proveedor').value = producto.proveedor;
  document.getElementById('uso').value = producto.uso;
  document.getElementById('nombre').value = producto.nombre;
  document.getElementById('codigo').value = producto.codigo;
  document.getElementById('precio').value = producto.precio;
  document.getElementById('stock').value = producto.stock;
  document.getElementById('descripcion').value = producto.descripcion;

  // Mostrar previsualizaciones si hay imágenes guardadas
  const preview = document.getElementById('previewContainer');
  preview.innerHTML = '';
  if (producto.imagenes && producto.imagenes.length) {
    producto.imagenes.forEach(img => {
      const imgEl = document.createElement('img');
      imgEl.src = `images/${img}`;
      preview.appendChild(imgEl);
    });
  }

  document.getElementById('tituloForm').textContent = 'Editar Producto';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==============================
// ELIMINAR PRODUCTO
// ==============================
async function eliminarProducto(id) {
  if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
  try {
    const res = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      alert('Producto eliminado correctamente');
      cargarProductos();
    }
  } catch (error) {
    console.error('Error al eliminar producto:', error);
  }
}

// ==============================
// LIMPIAR FORMULARIO
// ==============================
function limpiarFormulario() {
  document.getElementById('formProducto').reset();
  document.getElementById('id').value = '';
  document.getElementById('previewContainer').innerHTML = '';
  document.getElementById('tituloForm').textContent = 'Agregar / Editar Producto';
}

// ==============================
// PREVISUALIZACIÓN DE MÚLTIPLES IMÁGENES
// ==============================
function mostrarPrevisualizaciones(e) {
  const archivos = e.target.files;
  const contenedor = document.getElementById('previewContainer');
  contenedor.innerHTML = '';

  if (archivos.length === 0) return;

  Array.from(archivos).forEach(archivo => {
    const reader = new FileReader();
    reader.onload = event => {
      const img = document.createElement('img');
      img.src = event.target.result;
      contenedor.appendChild(img);
    };
    reader.readAsDataURL(archivo);
  });
}
