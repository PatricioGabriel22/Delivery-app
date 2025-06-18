--cambios en mongo-- 
quitar el value rol de los usuarios
db.users.updateMany({ rol: { $exists: true } },[{ $set: { rol: "" } }])


agrego el campo bistroOwner
db.productos.updateMany({ adminOwner: { $exists: true } },[{ $set: { bistroOwner: "$adminOwner" } }])
MongoServerError: $unset specification must be a string or an array

saco el campo adminOwner
db.productos.updateMany({ bistroOwner: { $exists: true } },{ $unset: { adminOwner: "" } })
MongoServerError: $unset specification must be a string or an array