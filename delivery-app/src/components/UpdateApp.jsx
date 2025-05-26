import toast from 'react-hot-toast'
import { registerSW } from 'virtual:pwa-register'


export const updateSW = registerSW({

    onNeedRefresh(){
        toast((t)=>(
            <div>
                <p>Nueva version disponible</p>
                <button onClick={()=>{
                        updateSW(true)
                        window.location.reload()
                        toast.dismiss(t.id)
                        console.log("click en update detectado")
                        
                    }}>
                    Actuualizar
                </button>
            </div>
        ),{duration:Infinity})
    },

    onOfflineReady(){
        toast.success('La app ya está lista para funcionar')
    }
})