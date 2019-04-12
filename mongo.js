
const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://fullstack:${password}@fullstackopen2019-i15da.gcp.mongodb.net/phonebook?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
    name: String,
    phone: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        phone: process.argv[4],
    })

    console.log(`Lisätään ${person.name} numero ${person.phone} luetteloon`)

    person.save().then(response => {
        mongoose.connection.close()
        process.exit(1)
    })
} else if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('Puhelinluettelo:')
        result.forEach(person => {
            console.log(person.name + ' ' + person.phone)
        })
        mongoose.connection.close()
        process.exit(1)
    })
} else {
    console.log('This program takes exactly one, or three arguments.\n' +
        'Just password for listing existing entries.\n' +
        'Password, name and phonenumber for adding new entries')
    process.exit(1)
}