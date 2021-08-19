import mongoose from 'mongoose'
import {config} from '../../configs/config.js'

let db = {};
export default function getConnection() {
        mongoose.connect(config.sqlurl, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            useCreateIndex: true          
        })
        .then(rs=>{
            db=rs;
            console.log('Connect successfully')
        })
        .catch(err=> console.log(err))
}
export {db};