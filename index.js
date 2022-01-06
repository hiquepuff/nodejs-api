const express = require('express')
const app = express()

app.use(express.json()) // All the output as json

const characters = [
    {
        id: 1,
        name: "Harry Potter",
        species: "human",
        house: "Gryffindor",
        actor: "Daniel Redcliffe"
    },
    null,
    {
        id: 2,
        name: "Hermione Granger",
        species: "human",
        house: "Gryffindor",
        actor: "Emma Watson"
    },
]


app.get('/', (req, res) => {
  res.send(characters.filter(Boolean)) // Bring all the non-null ones
})

// ADD CHARACTER
app.post('/add-character', (req, res) => {
    const character = req.body // Getting inputs from the body

    character.id = characters.length++
    characters.push(character) // Adding the character to the array

    res.send({message: "Character added successfully!"})
})

// Get a given character
app.get('/character/:id', (req, res) => {
    const id = +req.params.id
    // Looking for through the whole characters array
    const character = characters.find((c) => c.id === id)

    if (!character) { // If not found display a message
        res.status(404).send({message: "Character not found :/"})
        return
    }

    res.send(character)
})

// Update a given character
app.put('/character/:id', (req, res) => {
    const id = +req.params.id
    const character = characters.find((c) => c.id === id)

    if (!character) {
        res.status(404).send({message: "Character not found :/"})
        return
    }

    const {name, species, house, actor} = req.body

    character.name = name
    character.species = species
    character.house = house
    character.actor = actor

    res.send(character)
})

// Deleting a given character
app.delete('/character/:id', (req, res) => {
    const id = +req.params.id
    const character = characters.find((c) => c.id === id)

    if (!character) {
        res.status(404).send({message: "Character not found :/"})
        return
    }

    // Deleting the character
    delete characters[characters.indexOf(character)]

    res.send({message: 'Character deleted successfully!'})
})

app.listen(3000, () => { // Run the server 
    console.log('Server running at http://localhost:3000')
})