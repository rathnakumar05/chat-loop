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



  socket.on("webrtc", ({ data, to }) => {
    console.log(data);
    socket.to(to).timeout(5000).emit("webrtc", data, (err, response) => {
      console.log(response);      
    });
  });

  socket.on("webrtc_request", ({ data, to }) => {
    var session = socket.request.session;
    var data = {
      ...data,
      from: session.username,
      to
    }
    socket.to(to).timeout(5000).emit("webrtc_request", data, (err, response) => {
      console.log(response);      
    });
  });

  socket.on("webrtc_accept", ({ data, to }) => {
    console.log(to);
    var session = socket.request.session;
    var data = {
      ...data,
      from: session.username,
      to
    }
    socket.to(to).timeout(5000).emit("webrtc_accept", data, (err, response) => {
      console.log(response);      
    });
  });
}

module.exports = {
    p2p
}