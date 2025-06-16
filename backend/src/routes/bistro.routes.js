import { Router } from "express"
import { agregarCategoriaDeProductoAlLocal, estadoDelDelivery, findRestaurant, guardarNuevaConfiguracion} from "../controllers/bistro.controllers.js"
import { multerMiddleware } from "../middlewares/imageCloudinaryFunc.js"







export const bistroRoutes = Router()

bistroRoutes.get('/getRestaurant/:idRestaurant',findRestaurant)

bistroRoutes.post('/addCategoriaAlPerfil',agregarCategoriaDeProductoAlLocal)

bistroRoutes.post('/cambiarEstadoDelivery',estadoDelDelivery)

bistroRoutes.post('/nuevaConfiguracion/:idBistro',multerMiddleware().single('imagen'), guardarNuevaConfiguracion)
