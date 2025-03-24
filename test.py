ProductosPanaderia = [{'prodcuto':"Avena red velvet","cantidad":"5 paquetes"}];
# CantidadProducida = [44,5,7,9,1,3,23]

# ListaProductos = []


# for x in range(5):
#     auxObj = {}
#     auxObj[ProductosPanaderia[x]] = CantidadProducida[x]
#     ListaProductos.append(auxObj)

# print(ListaProductos)    


def ExtraerCantidades(cadena):
    return cadena.split()[0]


NumeroCantidadProducto = ExtraerCantidades(ProductosPanaderia[0]["cantidad"])

print(NumeroCantidadProducto)