const express = require("express");
const app = express()

app.use(express.json())


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get("/api/persons", (request, response) => {
    response.json(persons)
})


app.get("/info", (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>\n
    ${new Date().toLocaleString()}`)
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id)
    response.json(person)
})

app.post("/api/persons", (request, response) => {
    const person = request.body
    console.log(person)
    person.id = Math.floor(Math.random() * 99999999) 

    let error = null
    if (!person.name) {
        error = "name must not be empty"
    } else if (persons.find(person_ => person_.name === person.name)) {
        error = "name must be unique"
    } else if (!person.number) {
        error = "number must not be empty"
    } else {
        persons = persons.concat(person)
    }
    
    if (!error) {
        response.json(person)
    } else {
        response.status(400).json({"error": error}) 
    }
    
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
    response.status(204).end()
})

const PORT = env.process.port || 3001
app.listen(PORT)
console.log(`SERVER RUNNING ON PORT ${PORT}`)
