import Notification from '../../models/notification.js';
import statusCode from 'http-status-codes';

const createNotification = async (content,type)=>{
    try {
        const notification = await Notification.create({
            content,
            type,
            status: 0
        })
        return notification;
    } catch (error) {
        throw new Error();
    }
}
const markNotificationRead = async (_id) =>{
    try {
        const notification = await Notification.updateMany({_id:{$in:_id}},{
            status: 1
        })
        return notification;
    } catch (error) {
        throw new Error();
    }
}
const markRead = async (req,res) =>{
    try{
        const {payload} = req;
        const {_id} = req.body;
        await markNotificationRead(_id);
        return res.status(statusCode.OK).json({
            message: 'Update successfully',
            payload
        })
    } catch (error){
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            message: 'Error'
        })
    }
}
const get = async (req,res) =>{
    try {
        let {payload,user} = req;
        const {from=0,itemPerPage = 6} = req.query;
        const total = await Notification.find({_id : {$in : user.notification}}).countDocuments();
        const totalUnread = await Notification.find({
                                                _id : {$in : user.notification},
                                                status : 0
                                            }).countDocuments();
        const notification = await Notification.find({_id : {$in : user.notification}})
                                                .limit(parseInt(itemPerPage))
                                                .skip(parseInt(from))
                                                .sort({'created_at':-1})
                                                .lean();
        payload = {...payload,notification,total,totalUnread};
        return res.status(statusCode.OK).json({
            message: 'Get successfully',
            payload
        });
    } catch (error) {
        console.log(error);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            message: 'Error'
        })
    }
}
export {
    markNotificationRead,
    createNotification
}
export default {
    markRead,
    get
}