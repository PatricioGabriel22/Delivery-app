


export const ListaProductos =  [
    { nombre: 'Flautas', precio: 50, descripcion: 'Deliciosas flautas rellenas de carne o pollo.' },
    { nombre: 'Minion', precio: 30, descripcion: 'Galleta con forma de Minion, ideal para niños.' },
    { nombre: 'Figasas', precio: 40, descripcion: 'Panecillos suaves y esponjosos con un toque dulce.' }
]

ListaProductos.forEach(producto=>producto.cantidad = "")

console.log(ListaProductos)