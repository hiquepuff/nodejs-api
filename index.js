const express = require("express");
const mongoose = require("mongoose");
const Character = require("./models/Character");
const app = express();

app.use(express.json()); // All the output as json

// Getting the database
try {
  mongoose.connect(
    "mongodb+srv://admin:admin@cluster0.mu3cu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
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

app.get("/", (req, res) => {
  res.send(characters.filter(Boolean)); // Bring all the non-falsy ones
});

// ADD CHARACTER
app.post("/add-character", async (req, res) => {
  // Asynchronous function
  const { name, species, house, actor } = req.body; // Getting inputs from the body

  // Checking if client has sent all the required data
  if (!name || !species || !house || !actor) {
    res.status(400).send({ message: "Missing data" });
    return;
  }

  // Creating the model
  const character = await new Character({
    name,
    species,
    house,
    actor,
  });

  await character.save();

  res.send({ message: "Character added successfully!" });
});

// Get a given character
app.get("/character/:id", (req, res) => {
  const id = +req.params.id;
  // Looking for through the whole characters array
  const character = characters.find((c) => c.id === id);

  if (!character) {
    // If not found display a message
    res.status(404).send({ message: "Character not found :/" });
    return;
  }

  res.send(character);
});

// Update a given character
app.put("/character/:id", (req, res) => {
  const id = +req.params.id;
  const character = characters.find((c) => c.id === id);

  if (!character) {
    res.status(404).send({ message: "Character not found :/" });
    return;
  }

  const { name, species, house, actor } = req.body;

  character.name = name;
  character.species = species;
  character.house = house;
  character.actor = actor;

  res.send(character);
});

// Deleting a given character
app.delete("/character/:id", (req, res) => {
  const id = +req.params.id;
  const character = characters.find((c) => c.id === id);

  if (!character) {
    res.status(404).send({ message: "Character not found :/" });
    return;
  }

  // Deleting the character
  delete characters[characters.indexOf(character)];

  res.send({ message: "Character deleted successfully!" });
});

app.listen(3000, () => {
  // Run the server
  console.log("Server running at http://localhost:3000");
});
