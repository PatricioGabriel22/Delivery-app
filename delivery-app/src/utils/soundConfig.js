



export function generateNotificationSound(soundRoute,volumen){
    // '/sounds/notificationPreOrder.mp3'
    
    const sound = new Audio(soundRoute)
    sound.volume = volumen
    sound.currentTime = 0
    sound.loop = true
    sound.play()

    if(navigator.vibrate){
        navigator.vibrate(200)
    }

    return sound

}


export function preventStopNotification(notificationSound){

    if (notificationSound) {
        notificationSound.pause();
        notificationSound.currentTime = 0;
        notificationSound = null;
    }
}


