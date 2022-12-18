const peers = require("./peers.js");

const socketConnection = function (io) {
    io.use((socket, next) => {
      const session = socket.request.session;
      if (session && session.auth=="Y") {
        next();
      } else {
        next(new Error("unauthorized"));
      }
    });
    
    io.on("connection", async (socket) => {
        const session = socket.request.session;
        socket.join(session.username);      
        peers.p2p(socket, io);
      
        socket.on("logout", () => {
          socket.disconnect(true);
        });
    });
}

module.exports = socketConnection;