const mongoose = require("mongoose")

const connectToMongo = (password) => {
    const url = `mongodb+srv://fullstack:${password}@cluster0.udg0a2r.mongodb.net/?retryWrites=true&w=majority`

    mongoose.set('strictQuery', false)
    mongoose.connect(url)
    console.log('Connected to mongo')
}


if (process.argv.length !== 1 + 2 && process.argv.length !== 3 + 2) {
    console.log('Wrong args num')
    process.exit(1)
}


const password = process.argv[2]
connectToMongo(password)


const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
    console.log('Inserting person')

    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    
    person.save().then(result => {
        console.log(`Person ${person} saved to db`)
        mongoose.connection.close()
    })
}

if (process.argv.length === 3) {
    Person.findOne({"name": "Igor"}).then(result => {
        console.log(`Got result: ${result}`)
        console.log(typeof(result))
        console.log(result==={})
        console.log(result===[])
        if (!Boolean(result)) {
            console.log("No result")
        }
        result.forEach(person => console.log(person))
        mongoose.connection.close()
    }).catch(error => console.log(error))
}
