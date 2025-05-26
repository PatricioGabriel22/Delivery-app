import toast from 'react-hot-toast'
import { registerSW } from 'virtual:pwa-register'



    async function handleUpdateApp(t){
        toast('Actualizando...',{icon:'⏳'})
        await updateSW(true)



        setTimeout(()=>{
            toast.dismiss(t.id)
            window.location.reload()
        },1000 * 10)

        
    }

export const updateSW = registerSW({

    onNeedRefresh(){
        toast(t=>(
            <button className="cursor-pointer" onClick={()=>handleUpdateApp(t)}>
                <p>Hay una nueva version de la app!</p>
                <p>Toca aqui para </p>
                <p>🔔ACTUALIZAR🔔</p>
                <span className='w-full h-[1px] bg-red-600'/>
            </button>
            ),{

            duration:Infinity,
            style: {
                borderRadius: '10px',
                background: '#dc2626',
                border:'3px solid #ffffff',
                color: '#fff',
            }
        }) 
    },

    onOfflineReady(){
        toast.success('La app ya está lista para funcionar')
    }
})