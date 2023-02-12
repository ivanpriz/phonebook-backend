const express = require("express")
const cors = require("cors")
const path = require("path")
const Person = require("./models/person")
require("dotenv").config()

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, "/build")))

app.get("/api/persons", (request, response, next) => {
    Person.find({})
        .then(persons => response.json(persons))
        .catch(error => next(error))
})

app.get("/api/persons/:id", (request, response, next) => {
    const id = String(request.params.id);
    Person.findOne({"_id": id}).then(person => {
        if (person) {
            response.json(person)
            return
        }
        response.status(404).end()
    }).catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
    const person = Person(request.body)
    console.log(`Received to insert: ${person}`)

    let error = null
    if (!person.name) {
        error = "name must not be empty"
    } else if (!person.number) {
        error = "number must not be empty"
    }
    if (error) {
        response.status(400).json({"error": error})
    }

    Person.findOne({"name": person.name}).then(personExisting => {
        if (personExisting) {
            response.status(400).json({"error": "name must be unique"})
            return
        }
        person.save().then(result => {
            console.log(`${result} saved to db`)
            response.json(result.toJSON())
        }).catch(error => next(error))
    })   
})

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => response.status(204).end())
        .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
    const person = {
        name: request.body.name,
        number: request.body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => response.json(updatedPerson))
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`SERVER RUNNING ON PORT ${PORT}`)
