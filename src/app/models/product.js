import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        require:true
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    quantity:{
        type: Number,
        require:true
    },
    price: {
        type: Number,
        require:true
    },
    album: [{
        type: String
    }],
    description: {
        type: String
    },
    publishedYear:{
        type: Number,
        require:true
    },
    blog:{
        type: String,
    },
    status: {
        type: Boolean,
        default: true
    },
},{
    timestamps:{createdAt:'created_at', updatedAt:'update_at'}
})
const Product=mongoose.model('Product',productSchema);
export default Product;