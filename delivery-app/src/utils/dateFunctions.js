



const hoy = new Date();
const inicioDelDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()); //las 00 si no se pasan horas,min,seg
const finDelDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);

export const esDeHoy = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha >= inicioDelDia && fecha < finDelDia;
};
