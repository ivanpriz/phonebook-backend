const mongoose = require("mongoose")
require("dotenv").config()

mongoose.set("strictQuery", false)

const url = process.env.MONGODB_URI

console.log("Connecting to MongoDB", url)

mongoose.connect(url)
    .then(result => {
        console.log("connected to MongoDB")
    })
    .catch((error) => {
        console.log("error connecting to MongoDB:", error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, 'Name too short, must be at least 3 chars long!'],
        required: [true, 'Name is required!']
    },
    number:{
        type: String,
        minLength: [8, 'Phone number too short!'],
        validate: {
            validator: function(v) {
                return /(\d{2}|\d{3})-\d+/.test(v)
            },
            message: props => `${props.value} is not a valid number!`
        },
        required: [true, 'Phone number is required!']
    }
})

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Person", personSchema)
