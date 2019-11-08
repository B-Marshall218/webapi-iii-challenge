const express = require('express');

const server = express();

const userRouter = require("./users/userRouter");
const postRouter = require("./posts/postRouter");

server.use(logger);
server.use(express.json()); //whats the purpose of this again?
server.use("/api/users", userRouter);
server.use("/api/posts", postRouter);





server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to${req.url} ${req.get("Origin")}`)

  next();
};




module.exports = server;
