



const hoy = new Date();
const inicioDelDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()); //las 00 si no se pasan horas,min,seg
const finDelDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);

export const esDeHoy = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha >= inicioDelDia && fecha < finDelDia;
};



export const verFecha = (date) => {
    const fecha = new Date(date); // Convertir string a objeto Date
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // +1 porque enero es 0
    const anio = fecha.getFullYear();
  
    return `${dia}/${mes}/${anio}`;
};

export const verHoraYMinutos = (date) => {
    const fecha = new Date(date);
    let horas = fecha.getHours();
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const ampm = horas >= 12 ? 'PM' : 'AM';
  
    horas = horas % 12;
    horas = horas ? horas : 12; // el 0 se transforma en 12
  
    return `${horas}:${minutos} ${ampm}`;
}


  