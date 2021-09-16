const socket = io();
let question;
let correctAnwser;
socket.on("playerconnected", (data) => {});
socket.on("questions", (data) => {
  addQuestionToHtml(data[0]);
  radioListner();
});
function addQuestionToHtml(data) {
  let questionHtml = "<label>" + data.question + "</label>";
  let anwsers = data.incorrect_answers;
  anwsers.push(data.correct_answer);

  question = data.question;
  correctAnwser = data.correct_answer;
  anwsers.forEach((item, index) => {
    questionHtml +=
      '<br /><label><input type="radio" name="question" value="' +
      item +
      '" />' +
      item +
      "</label>";
  });
  document.getElementById("question").innerHTML = questionHtml;
  console.log(data);
}
function radioListner() {
  radios = document.getElementsByName("question");
  for (radio in radios) {
    radios[radio].onclick = function (event) {
      let userSelected = event.target.value;
      let response = {
        question: question,
        correct_answer: correctAnwser,
        userSelected: userSelected,
      };
      socket.emit("answerSubmit", response);
    };
  }
}
socket.on("viewerConnected", () => {
  document.getElementById("question").innerHTML =
    "A player is already connected";
});
socket.on("viewerAnwser", (data) => {
  console.log(data);
  html =
    "<br> <br>" +
    "Question: " +
    data.question +
    "<br> User anwser: " +
    data.userSelected +
    "<br> Correct anwser: " +
    data.correct_answer;
  document.getElementById("question").innerHTML += html;
});
