import productSchema from "../models/product.schema.js"
import preOrderSchema from "../models/preOrder.schema.js"


export const shoppingCart = async (req, res) => {
    const {productList,userInfo} = req.body

    try {
        console.log(productList)
        console.log(userInfo)
        
    } catch (error) {
        console.log(error)
    }
}



export const checkPreOrderWithLocal = async (req,res)=>{

    const {preOrderPayload,userInfo,importeTotal} = req.body

   

    try {
        console.log(req.body)
        


        await new preOrderSchema({
            userID:userInfo.id,
            userInfo,
            preOrder:preOrderPayload,
            importeTotal:importeTotal
        }).save()

        res.status(200).json({message:"Pre-Orden creada"})


        
    } catch (error) {
        console.log(error)
    }

}



export const getAllPreOrders = async (req,res)=>{
    const allPreOrders = await preOrderSchema.find({}).sort({createdAd:-1})
    res.json(allPreOrders)
}


export const handlePreOrder = async (req,res)=>{
    const {confirmedOrder} = req.body

    const target = await preOrderSchema.find({_id:confirmedOrder._id})
    
    console.log(target.importeTotal)

    res.json({
        message:"Su pedido ha sido confirmado",
        target

    })
    
}