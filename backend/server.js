const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const colors = require('colors')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const { notFound, errorHandler } = require('../backend/middleware/errorMiddleware')

const app = express();
dotenv.config();
connectDB();

const PORT = process.env.PORT

app.use(express.json()); // To accept JSON data
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);


app.use(notFound)
app.use(errorHandler)


app.listen(PORT, console.log(`Server started on PORT ${PORT}`.yellow.bold));