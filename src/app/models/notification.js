import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    content:{
        type: String
    },
    status:{
        type: Number,
        require: true
    },
    type:{
        type: Number,
        require: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps : {createdAt:'created_at',updatedAt:'updated_at'}
});

const Notification = mongoose.model('Notification',notificationSchema);
export default Notification;