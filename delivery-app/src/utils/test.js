import Fuse from 'fuse.js'

const zonas_delivery = [
    {
        zona:"monte grande",
        costoEnvio: 3500

    },
    {
      zona:"luis guillon",
      costoEnvio:2500  
    }
]

const fuse = new Fuse(zonas_delivery,{threshold: 0.3, keys:["zona"]})

const result = fuse.search("mont3")

console.log(result)



