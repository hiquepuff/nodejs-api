const database = () => {
    const mongoose = require('mongoose')
    
    try {
        mongoose.connect(
          process.env.DATABASE_URI, // Getting a variable from the environment
          {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          }
        );
        console.log("Database connected successfully!");
      } catch (err) {
        // If error detected...
        console.log("ERROR: database not connected :/");
      }
}

  module.exports = database()