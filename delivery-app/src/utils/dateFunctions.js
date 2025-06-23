



export const esDeHoy = (fechaStr) => {
  const fecha = new Date(fechaStr).toLocaleDateString('es-AR')
  const hoy = new Date().toLocaleDateString('es-AR')
  return fecha === hoy
}


export const verFecha = (date) => {
    const fecha = new Date(date); // Convertir string a objeto Date
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // +1 porque enero es 0
    const anio = fecha.getFullYear();
  
    return `${dia}/${mes}/${anio}`;
};

export const verHoraYMinutos = (date) => {
    
    const fecha = new Date(date)

    let horas = fecha.getUTCHours()

    const minutos = fecha.getUTCMinutes().toString().padStart(2, '0')

    const ampm = horas >= 12 ? 'PM' : 'AM'
  

    
    return `${horas}:${minutos} ${ampm}`;
}


  