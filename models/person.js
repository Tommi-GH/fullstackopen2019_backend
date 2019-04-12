const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
const url = process.env.MONGODB_URI

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

console.log('connecting to ', url)

if (process.env.NODE_ENV === 'production') {
    mongoose.connect(url)
        .then(console.log('connected to mongodb'))
        .catch(error => console.log(error))
} else {
    mongoose.connect(url, { useNewUrlParser: true })
        .then(console.log('connected to mongodb'))
        .catch(error => console.log(error))
}
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        unique: true,
        required: true
    },
    phone: {
        type: String,
        minlength: 8,
        required: true
    }
})

personSchema.plugin(uniqueValidator, { type: 'mongoose-unique-validator' })

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)