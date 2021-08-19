import User from '../../models/user.js';
import bcryptjs from 'bcryptjs';
import {decrypt} from '../../utils/crypto.util.js';
import jwt from '../../utils/jwt.util.js';
// import JSEncrypt from 'node-jsencrypt';
import {hashLen,roles} from '../../../constants/credential.constant.js';
import {statusCode} from '../../../constants/response.constant.js';

const signUser = (user)=> {
    const {_id,name,role} = user;
    return {
        token: jwt.sign({_id,name,role}), 
        refresh: jwt.sign_refresh({_id,name,role})
    }
}
const signUp = async (req,res)=>{
    try {
        const {username,name,password} = req.body;
        const user = await User.create({
            name,
            // username,
            // password: bcryptjs.hashSync(password,hashLen),
            username: decrypt(username),
            password: bcryptjs.hashSync(decrypt(password),hashLen),
            cart: [],
            order: [],
            favorite: [],
            notification:[],
            role: roles.CUSTOMER
        });
        delete user['username'];
        delete user['password'];
        const {token,refresh} = signUser(user);
        return res.status(statusCode.OK).json({
            payload: {user,token,refresh}
        })
    } catch (error) {
        console.log(error);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send();
    }
}
const signIn = async (req,res) => {
    try {
        let {username,password} = req.body;
        username = decrypt(username);
        password = decrypt(password);
        const user = await User.findOne({username}).lean().populate('cart.product','_id name category quantity price album status');
        if(bcryptjs.compareSync(password,user.password)){
            // delete user['username'];
            // delete user['password'];
            const {token,refresh} = signUser(user);
            res.status(statusCode.OK).json({
               payload:{ user,token,refresh}
            })
        }else return res.status(statusCode.UNAUTHORIZED).send();

    } catch (error) {
        console.log(error);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send();
    }
}
const signInToken = async (req,res) => {
    try {
        let {payload,user} = req;
        payload = {...payload, user : await User.findById(user._id).lean().populate('cart.product','_id name category quantity price album status')};
        return res.status(statusCode.OK).json({
            payload
        })
    } catch (error) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send();
    }
}
const signOut = () =>{

}

export default {
    signUp,
    signIn,
    signOut,
    signInToken
}