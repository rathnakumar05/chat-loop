var Messages = require("../models/messages");

function p2p(socket, io) {
  socket.on("p2p", ({ message, to }) => {
    var session = socket.request.session;
    var message_data = {
      message,
      from: session.username,
      to,
    };
    
    socket.to(to).timeout(5000).emit("p2p", message_data, (err, response) => {
      var seen = 0;
      if (err) {
        //
      } else {
        if (response.length !== 0) {
          if (response[0].seen == "Y") {
            seen = 1;
          }
        } 
      }

      message_data.seen = seen==1 ? "Y" : "N";
      var messages = new Messages(message_data);

      messages.save(function (err) {
        if (err) {
          console.log(err);
        }
      })
      
    });
  });
}

module.exports = {
    p2p
}