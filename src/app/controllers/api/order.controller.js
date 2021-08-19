import Order from '../../models/order.js';
import Product from '../../models/product.js';
import User from '../../models/user.js';
import statusCode from 'http-status-codes';
import {createNotification} from '../../controllers/api/notification.controller.js';
import moment from 'moment';
import {orderStatus} from '../../../constants/order.constant.js';
import { roles } from '../../../constants/credential.constant.js';

const checkConfirmCart = (cart, confirmCart) =>{
    let _cart = {};
    cart.forEach(i=>{
        _cart = {
            ..._cart,
            [i.product._id.toString()]:{
                quantity: i.product.quantity,
                quantityInCart: i.quantity,
                status: i.product.status
            }
        }
    });
    let isValid = true;
    confirmCart.forEach(i=>{
        const v = _cart[i];
        isValid = (isValid && v.status === true && v && v.quantity >= v.quantityInCart) ;
    });
    return isValid;
}
const validateConfirmCart = async (req,res) =>{
    try {
        const {payload,user} = req;
        const confirmCart = req.body.cart;
        const {cart} = await User.findById(user._id).select('cart').populate('cart.product','_id quantity status').lean();
        if(checkConfirmCart (cart,confirmCart)){
            return res.status(statusCode.OK).json({
                message : 'Valid cart',
                payload
            })
        } else return res.status(statusCode.BAD_REQUEST).json({
                message : 'Invalid cart',
                payload
        })
    } catch (error) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            message: 'Error'
        })
    }
}
const checkout = async (req,res)=>{
    try {
        let {payload,user} = req;
        const {info} = req.body;
        const confirmCart = req.body.cart;
        const {cart} = await User.findById(user._id).select('cart').populate('cart.product','_id quantity status price').lean();
        if(checkConfirmCart(cart,confirmCart)){
            let products=[];
            let total = 0;
            cart.forEach(i=>{
                if(confirmCart.includes(i.product._id.toString())){
                    Product.updateOne({_id:i.product._id},{quantity: (i.product.quantity-i.quantity)}).then(rs=>rs);
                    products.push({
                        product : i.product._id,
                        quantity : i.quantity,
                        price : i.product.price,
                        status : 0
                    })
                    total+= i.quantity*i.product.price;
                }
            })
            const order = await Order.create({
                products,
                info,
                total,
                status: 0,
                timeDeliver: '',
                timeApproved: '',
                timeCompleteDelivery: ''
            });
            const updateCart = cart.filter(i=>!confirmCart.includes(i.product._id.toString()))
                                    .map(i=>{
                                        return {
                                            product : i.product._id,
                                            quantity : i.quantity
                                        }
                                    })
            const updateUser = await User.findByIdAndUpdate(user._id,{
                $push : {order: order._id},
                cart : updateCart
            },{new:true}).lean().populate('cart.product','_id name category quantity price album status');
            const notification = await createNotification(
                JSON.stringify({
                    image: '',
                    order_id: order._id,
                    message: 'New Order. Waiting for being approved',
                    title: `Order: ${order._id} - ${moment(order.created_at).format('MMMM Do YYYY, h:mm:ss a')} `
                }),1);
            await User.updateMany({role:roles.ADMIN},{$push:{notification:notification._id}});
            global.io.to(user._id.toString()).emit('updateCart',updateUser.cart);
            //global.io.to(user._id.toString()).emit('sync',{...user, cart: updateCart});
            global.io.to('admin').emit('notification',notification);
            return res.status(statusCode.OK).json({
                message: 'Checkout successfully',
                payload
            })
        }else return res.status(400).json({
            message : 'Invalid cart',
            payload
        })
    } catch (error) {
        console.log(error);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            message: 'Error'
        })
    }
};
const get = async (req,res)=>{
    try {
        let {payload,user} = req;
        const {_id} = req.query;
        let order;
        if(_id){
            order = await Order.findById(_id)
                               .lean()
                               .populate('products.product','album category name _id');
            const orderedUser = await User.findOne({order:_id},'_id name').lean();
            payload = {...payload,orderedUser};
        }else{
            order = await Order.find({_id: user.order})
                               .lean()
                               .populate('products.product','album category name _id');
        }                       
        payload = {...payload,order};
        return res.status(200).json({
            message:'Get successfully',
            payload
        })
    } catch (error) {
        console.log(error);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            message: 'Error'
        })
    }
}

const approve = async (req,res) =>{
    try {
        let {payload} =req;
        const {order} = req.body;
        const approvedOrder = await Order.findByIdAndUpdate(order._id,{
            products: order.products,
            message: order.message,
            status: orderStatus.APPROVED,
            timeApproved: new Date().toString(),
            timeDeliver: new Date().toString()
        },{new:true});
        const notification = await createNotification(
            JSON.stringify({
                image: '',
                message: 'Your order has been approved. It will be in Delivery Center soon. Thanks you and have a nice day!',
                title: `Order: ${approvedOrder._id} - ${moment(approvedOrder.created_at).format('MMMM Do YYYY, h:mm:ss a')} `
            }),0);
        const user = await User.findOneAndUpdate({order:approvedOrder._id},{ 
            $push:{notification : notification._id}
        }).select('id');
        global.io.to(user.id).emit('notification',notification);
        payload = {...payload,order:approvedOrder}
        return res.status(statusCode.OK).json({
            message : 'Approve successfully',
            payload
        })
    } catch (error) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            message: 'Error'
        })
    }
}

export default {
    checkout,
    validateConfirmCart,
    get,
    approve
}