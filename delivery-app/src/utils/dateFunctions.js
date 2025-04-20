



const hoy = new Date();
const inicioDelDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
const finDelDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);

export const esDeHoy = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha >= inicioDelDia && fecha < finDelDia;
};
