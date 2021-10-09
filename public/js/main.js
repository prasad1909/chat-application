const chatForm=document.getElementById('chat-form')
const chatMessages= document.querySelector(".chat-messages")
const socket = io();
const roomName=document.getElementById('room-name')
const userList=document.getElementById('users')
//get username and room from url

const {username, room} =Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
//Join chatroom
socket.emit('joinRoom',{ username, room});

//get room users
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
})

socket.on('message', message => {
    console.log(message)
    OutputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
})

//message submit

chatForm.addEventListener('submit' ,(e) => {
    e.preventDefault();

    const msg=e.target.elements.msg.value;

    //Emitting message to server

    socket.emit('chatMessage',msg)
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
})


function OutputMessage(message){
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class= "meta">${message.username}<span> ${message.time} </span></p>
                    <p class="text"> ${message.text} </p> `;
    document.querySelector(".chat-messages").appendChild(div);
}

function outputRoomName(room){
    roomName.innerText=room
}
function outputUsers(users){
    userList.innerHTML='';
    users.forEach(user => {
        const li=document.createElement('li')
        li.innerText=user.username
        userList.appendChild(li);
    });
}