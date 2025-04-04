


export const ListaProductos =  [
    { nombre: 'Flautas', precio: 50, descripcion: 'Deliciosas flautas rellenas de carne o pollo.' },
    { nombre: 'Minion', precio: 30, descripcion: 'Galleta con forma de Minion, ideal para niños.' },
    { nombre: 'Figasas', precio: 40, descripcion: 'Panecillos suaves y esponjosos con un toque dulce.' }
]

ListaProductos.forEach(producto=>producto.cantidad = "")

console.log(ListaProductos)

console.log("--------------------------")
const orden = [
    {nombre: "Minion", precio: 30, cantidad: 1},
    {nombre: "Figasas", precio: 40, cantidad: 1},
    {nombre: "Flautas", precio: 50, cantidad: 3}
]

orden.push({confirmado:false})
console.log("La orden es:", orden)

orden[orden.length-1].confirmado = true

console.log("--------------------------")

console.log(orden)