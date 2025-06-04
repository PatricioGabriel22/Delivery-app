export async function modifyData(idTarget,schema,updateParams,file,socket,eventName){
    const targetPrevio = await schema.findById(idTarget)

    if(file){
        const newImagen = req.file.path
        updateParams.img = newImagen
        updateParams.public_IMG_ID = req.file.filename

        if(targetPrevio.public_IMG_ID){

            await cloudinary.uploader.destroy(targetPrevio.public_IMG_ID)
        }

    }

    const targetUpdated = await schema.findByIdAndUpdate(idTarget,updateParams,{new:true})



    socket.emit(eventName,targetUpdated)
}