const productos = [{nombre:"pepas"},{nombre:"budines"}]

const nuevo = {nombre:"torta",stock:20}



function add(target,lista){
    const isInLista = lista.find(item => item.nombre === target.nombre)


    if(!isInLista){
        lista.push(target)
    }

}

add(nuevo,productos)

console.log(productos)