const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const path = require("path");

dotenv.config();
connectDB();
const app = express();

// Configure CORS using FRONTEND_URL
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000", // Use FRONTEND_URL or fallback to localhost
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());

// API routes
app.use("/api/user", userRoutes);
app.use("/api/user/login", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// --------------------------deployment------------------------------
const __dirname1 = path.resolve();

console.log("process.env.NODE_ENV", process.env.NODE_ENV);

if (process.env.NODE_ENV === "production") {
  console.log("Production environment detected.");
  app.use(express.static(path.join(__dirname1, "/reactfirst/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "reactfirst", "build", "index.html"))
  );
} else {
  console.log("Development environment detected.");
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5001;
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

// Configure socket.io with CORS
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Use FRONTEND_URL for socket.io CORS
  },
});

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

  socket.on("new message", (newMessageReceived) => {
    console.log("New message received");
    var chat = newMessageReceived.chat;

    console.log("Chat", chat);

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", (userData) => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
