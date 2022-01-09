require('dotenv').config()
const express = require("express");
const app = express();
const controllers = require('./routes/controllers.js') // Getting the routes
const database = require('./database/database.js') // Getting the database

app.use(express.json()); // All the output as json
const port = process.env.PORT || 3000 // Adapted server port

app.use('/', controllers)

app.listen(port, () => {
  // Run the server
  console.log(`Server running at http://localhost:${port}`);
});
