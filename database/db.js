const  mognoose=require('mongoose')

module.exports=function db(){
mognoose.connect(process.env.URI,{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>console.log('connected to mongodb')).catch(e=>console.log(e))
}