import Product from '../../models/product.js'
import {productPagingConstant,ignoreInProductSearchFields} from '../../../constants/product.constant.js' 
import path from 'path';
import {writeFileSync} from '../../utils/image.util.js';
import {storagePath} from '../../../constants/image.constant.js';
import {statusCode} from '../../../constants/response.constant.js';

const create = async(req,res)=>{
    try {
        let {name, quantity,description, publishedYear, price, category, album, blog}=req.body;
        let {files,payload}=req;
        const time = Date.now().toLocaleString();
        if(!Array.isArray(album)) album=[album];
        album.map((n,index)=>{
            const fileName=name+time+index+path.extname(n);
            const file=files.find(f=>f.originalname===n);
            writeFileSync(storagePath,fileName,file.buffer);
            album[index]=fileName; 
        })
        const newProduct= await Product.create({
            name,
            category,
            quantity,
            album,
            description,
            publishedYear,
            price,
            blog,
            status : true
        });
        payload ={...payload, _id: newProduct._id};
        return res.status(statusCode.OK).json({
            message:'Create new product successfully',
            payload
        })
    } catch (error) {
        console.log(error)
       return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
           message: 'Error'
       })
    }
}
const update = async(req,res)=>{
    try {
        let {_id, name, quantity, description, publishedYear, price, category, blog, album}=req.body;
        let {files,payload}=req;
        if(files && files.length > 0){
            //const {albumFile} = files;
            const time = Date.now().toLocaleString();
            //if(files && files.length > 0){
                if(!Array.isArray(album)) album=[album];
                album.forEach((n,index)=>{
                    const fileName=name+time+index+path.extname(n);
                    const file=files.find(f=>f.originalname===n);
                    if(file){
                        writeFileSync(storagePath,fileName,file.buffer);
                        album[index]=fileName;
                    }
                });                
           // }
        }
        let updateData={
            name,
            quantity,
            description,
            publishedYear,
            price,
            category,
            blog,
            album
        }        
        payload = {...payload, product : await Product.findByIdAndUpdate(_id,{
                                                $set:updateData
                                                },{new:true})
        };
        return res.status(statusCode.OK).json({
            message:'Update product successfully',
            payload
        })
    } catch (error) {
        console.log(error)
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            message: 'Error'
        })
    }
}
const deleteProduct = async (req,res)=>{
    try {
        const {_id} = req.body;
        const {payload} = req;

        await Product.findByIdAndUpdate(_id,{
            $set:{
                status:false
            }
        })
        return res.status(statusCode.OK).json({
            message:'Delete product successfully',
            payload
        })
    } catch (error) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            message: 'Error'
        })
    }
}
const search = async (req,res)=>{
    try {
        let condition;
        let {
            name='',
            priceFrom=0,
            priceTo=Number.MAX_SAFE_INTEGER,
            page=productPagingConstant.DEFAULT_PAGE, 
            itemPerPage=productPagingConstant.ITEM_PER_PAGE,
            sortBy=productPagingConstant.SORT_BY,
            inc=productPagingConstant.SORT_INC
        }=req.query;
        let rawBody = req.query;
        
        for (let item in rawBody){
            if(ignoreInProductSearchFields.includes(item)) 
            delete rawBody[item]
        }
        const regex= new RegExp(name,'i');
        page=parseInt(page);
        itemPerPage=parseInt(itemPerPage);
        if(inc){
            if(inc==='true'){
                inc=productPagingConstant.SORT_INC;
            }else if(inc==='false'){
                inc=productPagingConstant.SORT_DES;
            }
        }
        condition = {
            $and : [
                {status:true},
                {name : {$regex:regex}},
                {price: {$gte: priceFrom}},
                {price: {$lte: priceTo}}
            ]
        }
        for(let property in rawBody){
            condition.$and.push({[property]:rawBody[property]})
        }
        let total=await Product.find(condition).countDocuments();
        total=Math.ceil(total/itemPerPage);
        const products=await Product.find(condition)
                                    .limit(itemPerPage)
                                    .skip((page-1)*itemPerPage)
                                    .sort({[sortBy]:inc})
                                    .lean();
        const payload={total,products}
        return res.status(statusCode.OK).json({
            message : 'Search product successfully',
            payload
        })
    } catch (error) {
        console.log(error)
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            message: 'Error'
        })
    }
}
const get = async (req,res)=>{
    try {
        const {_id}=req.params;
        let products={};
        if(_id) products= await Product.findOne({_id,status:true}).lean();
        else products= await Product.find({status:true}).lean();
        return res.status(statusCode.OK).json({
            message:'Get product successfully',
            payload: {products}
        })
    } catch (error) {
        console.log(error)
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            message: 'Error'
        })
    }
}
const getAll =async (req,res)=>{
    try {
        const products = await Product.find({status:true}).lean();
        return res.status(statusCode.OK).json({
            message:'Get product successfully',
            payload: {products}
        })
    } catch (error) {
        console.log(error)
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            message: 'Error'
        })
    }
}
export default {
    create,
    update,
    deleteProduct,
    search,
    get,
    getAll
}