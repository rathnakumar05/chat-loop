var mongoose = require('mongoose');

mongoose.connection.on('connected', () => {
  console.log('monogdb connected');
});

const mongodb = async function() {
    try {
        await mongoose.connect("mongodb://admin:12345678@localhost:27017/chat_loop", {
            authSource: "admin",
        });
      } catch (error) {
        console.log(error);
      }
}

module.exports = mongodb;
