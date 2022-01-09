const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
const Character = require("../models/Character");

router.get("/", async (req, res) => {
  const characters = await Character.find();
  if (characters.length === 0)
    res.status(404).send({ message: "No registered characters :/" });

  res.send(characters.filter(Boolean)); // Bring all the non-falsy ones
});

// ADD CHARACTER
router.post("/add-character", async (req, res) => {
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
router.get("/character/:id", async (req, res) => {
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
router.put("/character/:id", async (req, res) => {
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
router.delete("/character/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).send({ message: "Invalid ID :/" });
    return;
  }

  const character = await Character.findById(id);
  if (!character)
    return res.status(404).send({ message: "Character not found :/" });

  await character.remove();

  res.send({ message: "Character deleted successfully!" });
});

module.exports = router