// socketHandlers.js
import { generateNotificationSound, preventStopNotification } from '@/lib/audioUtils' // Ajustá el path si hace falta
import { Link } from 'react-router-dom'


export function handleConnection(socket, userInfo, BistroPreOrdersData) {
  const infoDeConexion = () => {
    socket.emit('sesionIniciada', userInfo)
    if (userInfo?.rol === "bistro") {
      BistroPreOrdersData()
    }
  }

  socket.on('connect', infoDeConexion)
  if (socket.connected) infoDeConexion()

  return () => socket.off('connect')
}

export function handleUserConnections(socket, setLoggedUsers) {
  socket.on('usuariosConectados', setLoggedUsers)
  return () => socket.off('usuariosConectados')
}

export function handlePreOrderEvents({
  socket,
  userInfo,
  setAllPreOrders,
  setAcceptedOrders,
  toast,
  refreshHistorialOrdenes,
  setLoading,
  setBuyBTN,
  setResponseFromServer,
  refresh
}) {
  let notificationSound = null

  const stopSound = () => {
    preventStopNotification(notificationSound)
    notificationSound = null
  }

  socket.on('nuevaPreOrdenRecibida', (data) => {
    const { username } = data.nuevaPreOrden.userInfo
    const { costoEnvio } = data.nuevaPreOrden

    notificationSound = generateNotificationSound('/sounds/notificationPreOrder.mp3', 0.7)

    setAllPreOrders(prev => [...prev, data.nuevaPreOrden])

    toast.custom((t) => (
      <div className={`${costoEnvio === 0 ? 'bg-sky-300' : 'bg-red-300'} px-5 p-2 rounded shadow-lg ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
        <Link to="/PreOrderManagement" className="text-black font-bold flex items-center gap-x-2">
          <img src="/logoApp.png" className="h-12 w-12" />
          <p className="font-medium">Nueva pre-orden de {username}</p>
        </Link>
      </div>
    ), { duration: 6000 })
  })

  socket.on('preOrderStatus', (data) => {
    const { ordenAceptada, mensajeAlUsuario, ordenRechazada } = data

    stopSound()

    if (ordenAceptada) {
      setAcceptedOrders(prev => [...prev, ordenAceptada])
      setAllPreOrders(prev => prev.filter(item => item._id !== ordenAceptada._id))
      toast.success(mensajeAlUsuario)
    }

    if (ordenRechazada) {
      setAllPreOrders(prev => prev.filter(item => item._id !== ordenRechazada._id))
      setLoading(false)
      setBuyBTN(true)
      setResponseFromServer({
        status: 'ordenRechazada',
        msg: mensajeAlUsuario
      })
    }
  })

  socket.on('preOrdenPagoVerificado', (data) => {
    setAcceptedOrders(prev => prev.map(item =>
      item._id === data._id ? { ...item, paymentMethod: data.paymentMethod } : item
    ))
  })

  socket.on('finishedOrder', (data) => {
    setAcceptedOrders(prev => prev.map(item =>
      item._id === data.finishedOrder._id ? { ...item, finished: true } : item
    ))
  })

  socket.on('deliveredOrder', (data) => {
    setAcceptedOrders(prev => prev.filter(item => item._id !== data.deliveredOrder._id))
  })

  socket.on('ordenPreparada', (data) => {
    toast.success(data.infoToUser)
  })

  socket.on('canceloMiPedido', (data) => {
    setAllPreOrders(prev => prev.filter(item => item._id !== data.preOrdenID))
    setAcceptedOrders(prev => prev.filter(item => item._id !== data.preOrdenID))
    toast(data.message, { icon: '⚠️', duration: 7000 })
  })

  return () => {
    socket.off('nuevaPreOrdenRecibida')
    socket.off('preOrderStatus')
    socket.off('preOrdenPagoVerificado')
    socket.off('finishedOrder')
    socket.off('ordenPreparada')
    socket.off('deliveredOrder')
    socket.off('canceloMiPedido')
  }
}

export function handleCatalogUpdates(socket, refresh) {
  socket.on('productoAgregado', (data) => {
    refresh(prev => ({
      ...prev,
      catalogoDelBistro: [...prev.catalogoDelBistro, data.nuevoProducto]
    }), false)
  })

  socket.on('productoEliminado', (data) => {
    refresh(prev => ({
      ...prev,
      catalogoDelBistro: prev.catalogoDelBistro.filter(prod => prod._id !== data.deletedId)
    }))
  })

  return () => {
    socket.off('productoAgregado')
    socket.off('productoEliminado')
  }
}

export function handleCatalogModifications(socket, refresh) {
  socket.on('AlterProductStatus', (data) => {
    refresh(prev => ({
      ...prev,
      catalogoDelBistro: prev.catalogoDelBistro.map(item =>
        item._id === data.target._id ? { ...item, disponible: data.target.disponible } : item
      )
    }), false)
  })

  socket.on('cardProductoActualizada', (data) => {
    refresh(prev => ({
      ...prev,
      catalogoDelBistro: prev.catalogoDelBistro.map(item =>
        item._id === data._id ? { ...data } : item
      )
    }))
  })

  return () => {
    socket.off('AlterProductStatus')
    socket.off('cardProductoActualizada')
  }
}

export function handleBistroSettingsChanges(socket, refreshopenBistros, setUserInfo) {
  socket.on('nuevaConfiguracion', (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data))

    refreshopenBistros(prev => {
      const nuevos = prev.openBistros.map(bistro => {
        if (bistro._id === data._id) {
          setUserInfo(prev => ({ ...prev, img: data.img }))
          return {
            ...bistro,
            zonas_delivery: [...data.zonas_delivery],
            categorias: [...data.categorias],
            img: data.img
          }
        }
        return bistro
      })

      return { ...prev, openBistros: nuevos }
    }, { revalidate: false })
  })

  return () => {
    socket.off('nuevaConfiguracion')
  }
}
