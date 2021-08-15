const path = require("path");

const express = require("express");
const app = express();
const http = require("http");
const httpServer = http.createServer(app);
const io = require("socket.io")(httpServer);
app.use(express.static(path.join(__dirname, "/public")));
const arrayshuffle = require("array-shuffle");

const axios = require("axios");
let firstUser = "";
io.on("connect", (socket) => {
  console.log("player connected:" + socket.id);
  if (firstUser == "") {
    firstUser = socket.id;
  }
  if (firstUser == socket.id) {
    getQuestions();
  } else {
    socket.emit("viewerConnected");
  }

  socket.on("answerSubmit", (data) => {
    if (firstUser == socket.id) {
      getQuestions();
      socket.broadcast.emit("viewerAnwser", data);
    }
  });
  socket.on("disconnect", () => {
    if (firstUser == socket.id) {
      firstUser = "";
    }
  });
  socket.on("playerdisconnect", () => {
    console.log("Player disconnected" + socket.id);
  });
  function getQuestions() {
    let questions = "";
    axios
      .get("https://opentdb.com/api.php?amount=1&type=multiple")
      .then(function (response) {
        console.log(response.data.results[0].incorrect_answers);
        response.data.results[0].incorrect_answers = arrayshuffle(
          response.data.results[0].incorrect_answers
        );
        console.log(response.data.results[0].incorrect_answers);
        questions = response.data.results;
        socket.emit("questions", questions);
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {});
  }
});

httpServer.listen(3000, () => {
  console.log("Server is listening on port 3000 ...");
});
