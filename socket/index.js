const io = require("socket.io")(8900 , {
    cors:{
        origin:"https://real-time-chat-swift-front.vercel.app"
    }, 
});

let users = [];

const addUser = (userId , socketId) => {
    !users.some((user) => user.userId === userId) && 
    users.push({userId , socketId});
};

const removeUser = (socketId) => {
    users = users.filter(user=> user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find(user=>user.userId === userId);
};

io.on("connection" , (socket) => {
    //user connection
    console.log("A user connected.");
    

    //get userid from client
    socket.on("addUser" , userId =>{
        if(users){ 
            addUser(userId , socket.id);
            io.emit('getUsers' , users);
        }else{
            console.log("Check socket Id");
        }
    });

    //send and get message
    socket.on("sendMessage" , ({senderId , receiverId , text}) => {
        const user = getUser(receiverId);
        if(user){
            io.to(user.socketId).emit("getMessage" , {
                senderId,
                text,
            });
            console.log(user);
        }else{
            console.log(user);
        }    
    });


    //user disconnection
    socket.on("disconnect", () => {
        console.log("A user disconnected");
       
        removeUser(socket.id);
        io.emit('getUsers' , users);
    });
});
//const io = require("socket.io-client");
//socket.current = io("http://localhost:8900/");
