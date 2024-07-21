const express = require("express")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const cors = require('cors');



const userRoutes = require('./routes/userRoutes')
const ChatRoutes = require('./routes/ChatRoutes')
const messageRoutes = require("./routes/messageRoutes");
const path = require("path");




dotenv.config();
connectDB();
const app = express();


const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Use FRONTEND_URL or fallback to localhost
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };
  
  app.use(cors(corsOptions));


app.use(express.json());



// app.get("/", (req,res) => {
//     res.send("api is running")
// })


app.use("/api/user", userRoutes);
app.use("/api/user/login", userRoutes);

app.use("/api/chat",ChatRoutes)
app.use("/api/message", messageRoutes);



// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

console.log("process.env.NODE_ENV", process.env.NODE_ENV);


if (process.env.NODE_ENV == "production") {
    console.log("my_loggggg");
  app.use(express.static(path.join(__dirname1, "/reactfirst/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "reactfirst", "build", "index.html"))
  );
} else {

    console.log("elseeeeeeeeeeee");
  app.get("/", (req, res) => {  
    res.send("API is running..");
  });
}



// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);




const port = process.env.port || 5001
// node/backed
const server = app.listen(5001, console.log(`server started port  ${port}` )  ) 


const io = require("socket.io")(server, { 
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5001", // Use FRONTEND_URL for socket.io CORS
        // credentials: true,
    },
  });

  console.log("fronendurl", process.env.FRONTEND_URL);
  
  io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
      socket.join(userData._id);
        socket.emit("connected");
    });
  
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    socket.on("new message", (newMessageRecieved) => {
        console.log("newMessageRecieved");
        var chat = newMessageRecieved.chat;

        console.log("cgat", chat);
    
        if (!chat.users) return console.log("chat.users not defined");
    
        chat.users.forEach((user) => {
          if (user._id == newMessageRecieved.sender._id) return;
    
          socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
      });
  
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
      
  })

    

//   socket.on("new message", (newMessageRecieved) => {
//     var chat = newMessageRecieved.chat;

//     if (!chat.users) return console.log("chat.users not defined");

//     chat.users.forEach((user) => {
//       if (user._id == newMessageRecieved.sender._id) return;

//       socket.in(user._id).emit("message recieved", newMessageRecieved);
//     });
//   });