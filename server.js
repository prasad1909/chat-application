const e = require('cors');
const express=require('express');
const path=require('path')
const http = require('http')
const app=express();
const port = 4000;
const socketio=require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers}= require('./utils/users');


const server =http.createServer(app);
const io=socketio(server);

const bot = 'RoomChat Bot' 

app.use(express.static(path.join(__dirname,'public')))

io.on('connection', socket => {
    socket.on('joinRoom', ({username,room}) => {
        const user = userJoin(socket.id,username,room);
        socket.join(user.room);
        //welcome current user
        socket.emit('message',formatMessage(bot,'Welcome to RoomChat'))

        //broadcasting when user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(bot,`${user.username} joined the chat`))

        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    
    //Listening to chatMessage
    socket.on('chatMessage', msg => {
        const user= getCurrentUser(socket.id)
        io.to(user.room).emit('message',formatMessage(user.username,msg))
    })

    //when user disconnects
    socket.on('disconnect', () => {
        const user=userLeave(socket.id)

        if (user){
        io.to(user.room).emit('message',formatMessage(bot,`${user.username} left the chat`))
            
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        })
        }
    })
})

server.listen(port, () => {
    console.log(`started at port ${port}`)
})