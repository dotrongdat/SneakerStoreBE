import path from 'path';
import Category from '../../models/category.js';
import {writeFile,writeFileSync} from '../../utils/image.util.js';
import {storagePath} from '../../../constants/image.constant.js';

const create = async(req,res)=>{
    try {
        const {name} = req.body;
        let {file,payload} = req;
        let logo = '';
        if(file){
            logo = 'logo'+name+Date.now().toLocaleString()+path.extname(file.originalname);
            writeFileSync(storagePath,logo,file.buffer);
        }
        payload = {...payload, category : await Category.create({name,logo,status:true})};
        return res.status(200).json({
            message:'Create new category successfully',
            payload
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error'
        })
    }
}
const getAll = async (req,res) =>{
    try {
        const payload = {categories : await Category.find({status:true}).lean()}
        return res.status(200).json({
            message:'Get all categories successfully',
            payload
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error'
        })
    }
}


export default {
    create,
    getAll
}