import bistroSchema from '../models/bistroSchema.js'
import axios from 'axios'


import dotenv from 'dotenv'
dotenv.config({
    path:`src/envs/.env.${process.env.NODE_ENV}`
})




export async function getValidAccessToken(bistroId) {
  const bistro = await bistroSchema.findById(bistroId)

  if (!bistro || !bistro.tokenMercadoPago) {
    throw new Error('El bistro no tiene credenciales de MercadoPago')
  }

  const { access_token, refresh_token, token_expires_at } = bistro.tokenMercadoPago

  // Si el token sigue vigente
  const tokenVigente = token_expires_at && new Date(token_expires_at) > new Date()

  if (tokenVigente) return access_token

  // Token expirado → refrescar
  try {
    const res = await axios.post('https://api.mercadopago.com/oauth/token', null, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        grant_type: 'refresh_token',
        client_id: `${process.env.CLIENT_ID}`,
        client_secret: `${process.env.CLIENT_SECRET}`,
        refresh_token,
      },
    })

    const newData = {
        //notacion especial para modificar partes especificas de un objeto (util para eveitar sobreescribir todo)
        //no reemplaza tokenMP sino que aputna a los key.value especificos
      'tokenMercadoPago.access_token': res.data.access_token,
      'tokenMercadoPago.refresh_token': res.data.refresh_token,
      'tokenMercadoPago.token_expires_at': new Date(Date.now() + res.data.expires_in * 1000),
    }

    await bistroSchema.findByIdAndUpdate(bistroId, newData)

    return res.data.access_token

  } catch (err) {
    console.error('Error refrescando token de MercadoPago:', err.response?.data || err.message)
    throw new Error('No se pudo refrescar el token')
  }
}