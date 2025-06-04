import { Router } from "express"
import { agregarCategoriaDeProductoAlLocal, estadoDelDelivery, findRestaurant } from "../controllers/bistro.controllers.js"







export const bistroRoutes = Router()


bistroRoutes.post('/addCategoriaAlPerfil',agregarCategoriaDeProductoAlLocal)

bistroRoutes.get('/getRestaurant/:idRestaurant',findRestaurant)

bistroRoutes.post('/cambiarEstadoDelivery',estadoDelDelivery)