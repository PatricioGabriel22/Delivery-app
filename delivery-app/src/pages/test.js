// const productos = [{nombre:"pepas"},{nombre:"budines"}]

// const nuevo = {nombre:"torta",stock:20}



// function add(target,lista){
//     const isInLista = lista.find(item => item.nombre === target.nombre)


//     if(!isInLista){
//         lista.push(target)
//     }

// }

// add(nuevo,productos)

// console.log(productos)

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);  // Esto te da la ruta normal (C:\Users\...)
const __dirname = path.dirname(__filename);

// console.log(__filename);
// console.log(__dirname);

console.log("url:", import.meta)

console.log("filename:",__filename)

