import mongoose from "mongoose"


// Sí, el valor de ref debe coincidir exactamente con el nombre del modelo que definiste con mongoose.model(), incluyendo las mayúsculas y minúsculas.


const bistroSchema = new mongoose.Schema({
    username:String,
    img: {type:String,default:""},
    public_IMG_ID: {type:String,default:""},
    email:String,
    password:String,
    direccion:String,
    localidad:String,
    entreCalles:String,
    telefono:Number,
    hintPassword:String,
    rol:{type: String, default:'bistro'},
    categorias:{type: [String],default:[]},
    menu:{type: [String], default: []},    
    doDelivery:{type:Boolean,default:true},
    isOpen:{type:Boolean,default:true},
    zonas_delivery:{type:[{
        zona:String,
        precio:Number
    }],default:[]},
    tokenMercadoPago:{
        type:{

            user_id: Number,
            access_token: String,
            refresh_token: String,
            token_expires_at:Date,
            conectado_en:Date


        },
        default:{}

    }
    
},{
    timestamps:true
})



export default mongoose.model('bistros',bistroSchema)

