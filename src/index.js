import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import {config} from '../configs/config.js'
import morgan from 'morgan';
import db from './db/db.js';
import route from './routes/index.js';
import cors from 'cors';
import {roles} from './constants/credential.constant.js';

const app=express();
const port=config.port;
const hostname=config.hostname.localhost;
const socketIoServer = new Server();

db();
const server = http.createServer(app);
app.use(cors());

app.use(express.json());
app.use(express.raw());
app.use(express.urlencoded({extended:false}));
app.use(morgan('combined'));
route(app);

const io = socketIoServer.attach(server,{cors:{origin:'*'}});
global.io=io;
io.on('connection',(socket)=>{
    socket.emit('connected');
    socket.join(socket._id);
    socket.on('syncSignIn',({user,socketID})=>{
        socketID.forEach(sk => io.to(sk).emit('signIn',user));
    })
    socket.on('syncSignOut',(socketID)=>{
        socketID.forEach(sk => io.to(sk).emit('signOut'));
    })
    socket.on('signIn',(user)=>{
        socket.join(user._id);
        switch (user.role) {
            case roles.CUSTOMER:               
                break;
            case roles.ADMIN:
                socket.join('admin');
                break;
            default:
                break;
        }
    });
    socket.on('signOut',(user)=>{
        socket.rooms.forEach(room=>{
            console.log(room);
            socket.leave(room)
        });
    });
    
})
server.listen(port,hostname,()=>{
    console.log(`Server is listening from ${hostname}:${port}`);
})