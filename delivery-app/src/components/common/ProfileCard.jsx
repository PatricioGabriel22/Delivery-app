/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { MdEditNote } from "react-icons/md";

import axios from 'axios'
import { useLoginContext } from "@context/LoginContext";
import { useSocketContext } from "@context/SocketContext";

import {ccapitalizer_3000} from '../../utils/capitalize.js'
import { IoStorefrontSharp } from "react-icons/io5";

export default function ProfileCard({ userInfo }) {
  const [isEditing, setIsEditing] = useState(false);
  
  const {renderORLocalURL,setUserInfo} = useLoginContext()
  const {socket} = useSocketContext()
  
  const [editableInfo, setEditableInfo] = useState({ ...userInfo })

  const handleChange = (e) => {
 
    setEditableInfo({ ...editableInfo, [e.target.name]: e.target.value })
  };

  const handleSave = () => {
    // Acá podrías enviar editableInfo a una API o función de actualización
    console.log("Guardando cambios:", editableInfo);
    setIsEditing(false);

    

    const editPayload = {
      userID:userInfo._id,
      editableInfo
    }

    console.log(editPayload)

    axios.post(`${renderORLocalURL}/editProfileInfo`,editPayload,{withCredentials:true})



  };

  const handleCancel = () => {
    setEditableInfo({ ...userInfo });
    setIsEditing(false);
  };


  useEffect(()=>{

    socket.on('newUserInfo',(data)=>{
      console.log(data)
      setUserInfo(data)
      localStorage.setItem('userInfo', JSON.stringify(data))
    })


    return ()=>{
        socket.off('newUserInfo')
    }

  },[])

  return (
    <Fragment>
      <div className="bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-auto flex flex-col gap-6 mb-2">
        {/* Header del perfil */}
        <div className="flex items-center gap-4 border-b pb-4">
          <div className="bg-red-100 p-3 rounded-full">
            {userInfo.rol ? (
              <IoStorefrontSharp size={40} className="text-red-700"/>
              
            ):(

              <FaRegUser size={40} className="text-red-700" />
            )}
          </div>
          
          <div>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="username" //este valor esta e.target.name
                  value={editableInfo.username}
                  onChange={handleChange}
                  className="text-xl font-bold text-gray-900 border rounded px-1 w-full"
                />
                <input
                  type="text"
                  name="telefono"
                  value={editableInfo.telefono}
                  onChange={handleChange}
                  className="text-sm text-gray-500 border rounded px-1 mt-1"
                />
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900">{userInfo.username}</h2>
                <p className="text-gray-500 text-sm">📞 {userInfo.telefono}</p>
              </>
            )}
          </div>

        </div>

        {/* Datos de dirección */}
        <div className="grid grid-cols-1 gap-2 text-gray-800 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium">📍 Dirección:</span>
            {isEditing ? (
              <input
                type="text"
                name="direccion"
                value={editableInfo.direccion}
                onChange={handleChange}
                className="border rounded px-1"
              />
            ) : (
              <span>{ccapitalizer_3000(userInfo.direccion)}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">🏘️ Localidad:</span>
            {isEditing ? (
              <input
                name="localidad"
                value={editableInfo.localidad}
                onChange={handleChange}
                className="border rounded px-1">

              </input>
            ) : (
              <span>{ccapitalizer_3000(userInfo.localidad)}</span>
            )}
          </div>
          {userInfo.entreCalles && (
            <div className="flex items-center gap-2">
              <span className="font-medium">🧭 Entre calles/Esquina:</span>
              {isEditing ? (
                <input
                  type="text"
                  name="entreCalles"
                  value={editableInfo.entreCalles}
                  onChange={handleChange}
                  className="border rounded px-1"
                />
              ) : (
                <span>{ccapitalizer_3000(userInfo.entreCalles)}</span>
              )}
            </div>
          )}
        </div>

        {/* Botones de acción */}
        {isEditing && (
          <div className="flex gap-4 justify-end">
            <button
              onClick={handleCancel}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Guardar
            </button>
          </div>
        )}
        <span className="w-full h-[1px] bg-red-700 mt-5"/>
        {/* Badge de rol */}
        <div className="flex ">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              userInfo.rol === "bistro"
                ? "bg-red-200 text-red-800"
                : "bg-blue-200 text-blue-800"
            }`}
          >
            { userInfo.rol !== "bistro" ? "cliente" : "bistro"}
          </span>

          <p 
            onClick={() => setIsEditing(true)}
            className={`justify-end ml-auto text-s text-black cursor-pointer hover:underline ${isEditing ? "invisible": "block" } `}
            size={30}
          >Modificar informacion</p>

        </div>
      </div>
    </Fragment>
  );
}
