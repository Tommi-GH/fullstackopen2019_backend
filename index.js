
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

morgan.token('body', function (req, res) {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
})

app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))

app.get('/', (req, res) => {
    res.send(
        '<p>Something went wrong :( </p>'
    )
})


app.get('/info', (req, res) => {
    Person.find({}).then(persons => {
        res.send(
            '<p>Puhelinluettelossa ' + persons.length + ' henkilöä</p>' +
            '<p>' + Date(Date.now()) + '</p>'

        )
    })
})


app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()))
    })
})



app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person.toJSON())
        } else {
            res.status(204).end()
        }
    })
        .catch(error => next(error))
})


/**Add person to memory list if request body has name and phone and neither are already in the list */
app.post('/api/persons', (req, res, next) => {
    const body = req.body

    console.log(body)

    if (body === undefined) {
        return res.status(400).json({ error: 'content missing' })
    }

    const person = new Person({
        name: body.name,
        phone: body.phone
    })

    person.save().then(savedPerson => savedPerson.toJSON())
        .then(savedFormattedPerson => {
            res.json(savedFormattedPerson)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        phone: body.phone
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson.toJSON())
        })
        .catch(error => next(error))
})

/**Remove person from memory */
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))

})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)