import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    products:[
        {
            product : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Product'
            },
            quantity : {
                type : Number,
                require : true
            },
            price : {
                type : Number,
                require : true
            },
            status : { // delivered or not yet or cancel
                type : Number,
                require : true
            },
            message:{
                type: String
            }
        }
    ],
    info:{
        receiverName : {
            type : String,
            require : true 
        },
        email : {
            type : String,
            require : true
        },
        phone : {
            type : String,
            require : true
        },
        address : {
            type : String,
            require : true
        },
        paymentMethod : {
            type : {
                type : Number
            },
            paymentInfo : {
                type: String
            }
        }
    },
    message:{
        type: String
    },
    total : {
        type : Number,
        require : true
    },
    status : {
        type : Number,
        require : true
    },
    timeDeliver : {
        type : String
    }, 
    timeApproved : {
        type : String
    },
    timeCompleteDelivery : {
        type: String
    }
},{
    timestamps:{createdAt:'created_at',updatedAt:'updated_at'}
})

const Order = mongoose.model('Order',orderSchema);

export default Order;