import { useEffect, useState } from 'react'

import { Download } from 'lucide-react'
import toast from 'react-hot-toast'




export default function InstallPwaBTN(){

    const [deferredPrompt, setDeferredPrompt] = useState(null)
    const [isInstalled, setIsInstalled] = useState(false)



    useEffect(()=>{
        // Detecta si ya está en modo standalone (instalada)
        //Detecto si la PWA ya está instalada y ejecutándose como app (en lugar de en una pestaña del navegador), sin importar si es en móvil o escritorio.
        const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true

        setIsInstalled(standalone)

        // Captura evento de instalación
        window.addEventListener('appinstalled', () => {
          
            toast("Aguarde a que la app se instale",{icon:'⏳'})
            setIsInstalled(true)
        })


        // Captura el evento para mostrar el botón
        const handler = (e) => {
            e.preventDefault()
            console.log(e)
            console.log('📦 beforeinstallprompt capturado')
            setDeferredPrompt(e)
        }

        window.addEventListener('beforeinstallprompt', handler)

        return () => {
            window.removeEventListener('beforeinstallprompt', handler)
        }

    },[])




    function handleInstallPWA(){

        if (!deferredPrompt) return

        deferredPrompt.prompt()

        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                toast('La instalacion comenzará ponto',{icon:'⚙️'})
            } else {
                toast.error('Instalacion cancelada')
            }
            setDeferredPrompt(null)
        })
    }

    if (isInstalled || !deferredPrompt) return null

    return(
        <button onClick={handleInstallPWA} className='flex gap-x-3 bg-red-600 p-2 rounded-full cursor-pointer m-5 '>
            <Download />
            <p>Descargate la app acá!</p>
            
        </button>
    )
}