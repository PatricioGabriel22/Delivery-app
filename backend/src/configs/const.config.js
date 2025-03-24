




export const {

    PORT = process.env.PORT || 4000,

    DB_USER = "ppuchetadev",
    
    DB_PASS_DELIVERYAPP = 'CrgEUzeZB1zkumeo',
    DB_PASS_TEST = "PnnuH3ItQh3INPwV",


    MONGO_CLUSTER_DELIVERYAPP = `mongodb+srv://ppuchetadev:${DB_PASS_DELIVERYAPP}@mern-landr.htkyrnn.mongodb.net/?retryWrites=true&w=majority&appName=MERN-LandR`,
    MONGO_CLUSTER_TEST = `mongodb+srv://ppuchetadev:${DB_PASS_TEST}@clustertestconection.secyw.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTestConection`,

    SECRET_JWT_TOKEN_KEY = "98y79hukh7gysbdkfjgbasdfhaw7iet864233244"

} = process.env