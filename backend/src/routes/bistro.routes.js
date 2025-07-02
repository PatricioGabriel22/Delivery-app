import { Router } from "express"
import { agregarCategoriaDeProductoAlLocal, estadoDelDelivery, getDeliveryStatus,getTiendaStatus,changeTiendaStatus, guardarNuevaConfiguracion} from "../controllers/bistro.controllers.js"
import { multerMiddleware } from "../middlewares/imageCloudinaryFunc.js"







export const bistroRoutes = Router()

bistroRoutes.get('/getDeliveryStatus/:idRestaurant',getDeliveryStatus)
bistroRoutes.get('/getTiendaStatus/:idRestaurant',getTiendaStatus)



bistroRoutes.post('/addCategoriaAlPerfil',agregarCategoriaDeProductoAlLocal)

bistroRoutes.post('/changeTiendaStatus/:idRestaurant',changeTiendaStatus)
bistroRoutes.post('/cambiarEstadoDelivery',estadoDelDelivery)

bistroRoutes.post('/nuevaConfiguracion/:idBistro',multerMiddleware().single('nueva_foto'), guardarNuevaConfiguracion)
