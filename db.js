const {MongoClient} = require('mongodb');


module.exports={
    connectToDb:(cb)=>{
        MongoClient.connect('mongodb://localhost:27017/bookstore')
           .then((client)=>{
                dbConnection=client.db()
                return cb()
           })
           .catch(err=>{
            console.error(err)
            return cb(err)
            })
    },
    getDb:()=> dbConnection
}