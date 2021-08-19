import Validation from '../utils/test.util.js';
import validator from 'validator';
import {SpecicalCharater} from '../../constants/regex.constant.js';
import jwt from 'jsonwebtoken';
export default (req,res)=>{
    // const name='nbvbnvsadsaddsa';
    // let rs={};
    // Validation(name).exist('not exist').notEmpty('empty',{ignore_whitespace:true}).gt(9,'Too short').custom((value)=>value=='name','Not equal name').validate(rs);
    // const obj={
    //     test:'qweqe',
    //     nema:'asdasd'
    // }
    // console.log(SpecicalCharater.test(''));
    const user = {name:'test',age:1};
    const token = jwt.sign(user,"123",{expiresIn:"2 mins"});
    const verify = jwt.verify(token,"123");
    const decode = jwt.decode(token,{json:true});
    res.status(200).send();
}