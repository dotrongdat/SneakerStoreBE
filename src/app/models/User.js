import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require:true
    },
    username:{
        type: String,
        require:true
    },
    password:{
        type: String,
        require:true
    },
    role:{
        type: Number,
        require: true
    },
    cart:[
            {   
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product"
                },
                quantity: {
                    type : Number,
                    require: true
                }
            }
    ],
    order: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        }
    ],
    favorite: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    notification:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notification",
        }
    ],
    message:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        }
    ],
    status: {
        type: Boolean,
        default: true
    },
},{
    timestamps:{createdAt:'created_at', updatedAt:'updated_at'}
})
userSchema.methods.toJSON= function(){
    const user=this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.username
    return userObject
}
const User=mongoose.model('User',userSchema);
export default User;