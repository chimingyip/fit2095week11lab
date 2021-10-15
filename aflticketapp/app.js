let express = require("express");
let path = require("path");
const teamsObj = require("./teams");
let app = express();
let server = require("http").Server(app);
let io = require("socket.io")(server);
let port = 8080;

server.listen(port, () => {
  console.log("Listening on port " + port);
});

app.use("/", express.static(path.join(__dirname, "dist/aflticketapp")));

io.on("connection", socket => {
  io.emit("updatedTeams", teamsObj);

  socket.on("purchase", (teamData) => {
    for (let i = 0; i < teamsObj.teams.length; i++) {
      if (teamsObj.teams[i].name === teamData.name) {
        teamsObj.teams[i].count = teamData.count;
      }
    }
    let senderAlertMsg = "Success: Thank you for purchasing " + teamData.count + " tickets of " + teamData.name + ".";
    let othersAlertMsg = "Someone purchased " + teamData.count + " tickets of " + teamData.name + ".";

    // console.log(senderAlertMsg);
    // console.log(othersAlertMsg);
    socket.emit("alert-sender", senderAlertMsg);
    socket.broadcast.emit("alert-others", othersAlertMsg);
    io.sockets.emit("updatedTeams", teamsObj);
  })
})



