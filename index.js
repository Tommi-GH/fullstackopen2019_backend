

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

let persons = require('./persons.json').persons

app.use(bodyParser.json())


app.get('/', (req, res) => {
    res.send(
        '<h1>Hello world</h1>'
    )
})


app.get('/info', (req, res) => {
    res.send(
        '<p>Puhelinluettelossa ' + persons.length + ' henkilöä</p>' +
        '<p>' + Date(Date.now()) + '</p>'

    )
})


app.get('/api/persons', (req, res) => {
    res.send(persons)
})


app.get('/api/persons/:id', (req, res) => {
    const person = persons.find(person => person.id === Number(req.params.id))

    if (person) {
        res.send(person)
    } else {
        res.sendStatus(404)
    }

})

/**Add person to memory list if request body has name and phone and neither are already in the list */
app.post('/api/persons', (req, res) => {
    const newPerson = req.body

    if (!newPerson.name || !newPerson.phone) {
        res.status(403).send({ error: 'name and phonenumber are required' })
        return
    }
    
    if (persons.find(existingPerson => existingPerson.name.localeCompare(newPerson.name) === 0)){
        res.status(403).send({ error: 'name already in use' })
        return
    }

    newPerson.id = Math.floor(Math.random() * 10000)
    persons = persons.concat(newPerson)
    res.send(newPerson)
})

/**Remove person from memory */
app.delete('/api/persons/:id', (req, res) => {
    persons = persons.filter(person => person.id !== Number(req.params.id))

    res.sendStatus(204)

})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})