 //Refer to socket.io for set up
var io = require('socket.io')(process.env.PORT || 8000); //process.env.PORT is use to deploy to heroku
const arrUserInfo = [];
//Listen to the event.
io.on('connection', socket => {
        //console.log(socket.id); //This should have new socket.id in terminal of server (node index)
        //Listen to the event when socket.emit (NEW_USER_SIGN_UP)
        socket.on('NEW_USER_SIGN_UP', user => { //NGUOI_DUNG_DANG_KY
            //Check if there's alreay user that has that name
            const isExist = arrUserInfo.some(e => e.name === user.name)
            socket.peerId = user.peerId;
            if (isExist) return socket.emit('SIGN_UP_FAILED');
            arrUserInfo.push(user);
        //Send data to client
        socket.emit('ONLINE_USER', arrUserInfo);
        //Tell users there is new user online, but the new user could not see other user already online
        socket.broadcast.emit('NEW_USER_ONLINE', user); 
   });
   //Keep track of user disconnected
   socket.on('disconnect', () =>{
    //Find index of disconnect user
    const index = arrUserInfo.findIndex(user => user.peerId === socket.peerId);
    //Then delete that user from array
    arrUserInfo.splice(index, 1);
    //Then emit to update online user
    io.emit('SOMEONE_DISCONNECTED', socket.peerId);
   });
});