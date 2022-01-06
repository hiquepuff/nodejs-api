require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const Character = require("./models/Character");
const app = express();

app.use(express.json()); // All the output as json
const port = process.env.PORT || 3000 // Adapted server port

// Getting the database
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

app.get("/", async (req, res) => {
  const characters = await Character.find();
  if (characters.length === 0)
    res.status(404).send({ message: "No registered characters :/" });

  res.send(characters.filter(Boolean)); // Bring all the non-falsy ones
});

// ADD CHARACTER
app.post("/add-character", async (req, res) => {
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
app.get("/character/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).send({ message: "Invalid ID :/" });
    return;
  }

  const character = await Character.findById(id);
  if (!character) res.status(404).send({ message: "Character not found :/" });

  res.send(character);
});

// Update a given character
app.put("/character/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).send({ message: "Invalid ID :/" });
    return;
  }

  // Getting the character
  const character = await Character.findById(id);
  if (!character) res.status(404).send({ message: "Character not found :/" });

  // Checking if it's missing input
  const { name, species, house, actor } = req.body;
  if (!name || !species || !house || !actor) {
    res.status(400).send({ message: "Missing data" });
    return;
  }

  // Updating the character properties
  character.name = name;
  character.species = species;
  character.house = house;
  character.actor = actor;

  await character.save();

  res.send({ message: `Character updated successfully`, character: character });
});

// Deleting a given character
app.delete("/character/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).send({ message: "Invalid ID :/" });
    return;
  }

  const character = await Character.findById(id);
  if (!character) return res.status(404).send({message: "Character not found :/"})

  await character.remove();

  res.send({ message: "Character deleted successfully!" });
});

app.listen(port, () => {
  // Run the server
  console.log(`Server running at http://localhost:${port}`);
});
