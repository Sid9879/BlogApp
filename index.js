const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server)
const port = 8080;
const cors = require('cors');
// const http = require('http'); // Import the HTTP module
// const socketIo = require('socket.io'); // Import socket.io

const connection = require('./db')
connection()

app.use(express.json({limit:'100mb'}))
app.use(cors())

app.set('view engine','ejs')

const userRouter = require('./routes/userRoutes'); // import file of router
const postRouter = require('./routes/postRoutes');
const messageRouter = require('./routes/message');




// // Initialize Socket.IO with the server
// const io = socketIo(server, {
//   cors: {
//     origin: '*', // Allow all origins
//     methods: ['GET', 'POST']
//   }
// });

// // Socket.IO connection handler
// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   // Listen for messages from clients
//   socket.on('sendMessage', (messageData) => {
//     // Broadcast message to all connected clients (or you can change it to only target the specific receiver)
//     io.emit('receiveMessage', messageData);
//   });

//   // Handle disconnection
//   socket.on('disconnect', () => {
//     console.log('A user disconnected:', socket.id);
//   });
// });

let user = new Map();

function addUser(userId, socketId) {
    if (!user.has(userId)) {
        user.set(userId, socketId);
    }
    return user;
}

function removeUser(socketId) {
    for (const [userId, id] of user.entries()) {
        if (id === socketId) {
            user.delete(userId);
            break;
        }
    }
}

io.on("connection", (socket) => {
    // console.log("A user connected: ", socket.id);

    socket.on('addUser', (userId) => {
        console.log("User joined with ID: ", userId);
        addUser(userId, socket.id);
        // console.log("Current users: ", Array.from(user.entries()));
    });

    socket.on('sendMessage', ({ text, sender, reciever }) => {
        console.log(`Message: ${text}, Sender: ${sender}, Receiver: ${reciever}`);
        if (user.has(reciever)) {
            const socketId = user.get(reciever);
            io.to(socketId).emit('getMessage', { sender, text });
        }
    });

    socket.on('disconnect', () => {
        console.log("User disconnected: ", socket.id);
        removeUser(socket.id);
        // console.log("Updated user map: ", Array.from(user.entries()));
    });
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Optionally, restart server gracefully
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
    // Optionally, restart server gracefully
  });


app.get('/',(req,res)=>{
res.send('Welcome Page')
})

app.use('/users',userRouter) // to use routes
app.use('/posts',postRouter)
app.use('/message',messageRouter)

server.listen(port,(req,res)=>{
    console.log(`server is running on port number ${port}`)
})