const mongoose=require('mongoose')

async function connect(){
    try {
        await mongoose.connect('mongodb://localhost:27017/db',{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        console.log('connect successfully')
    } catch (error) {
        console.log('failure')
    }
}

module.exports=connect