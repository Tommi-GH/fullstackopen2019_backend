

const express = require('express')
const app = express()
const persons = require('./persons.json')

app.get('/', (req,res) => {
    res.send(
        '<h1>Hello world</h1>'
    )
})

app.get('/', (req,res) => {
    res.send(
        '<h1>Hello world</h1>'
    )
})

app.get('/api/persons', (req,res) => {
    res.send(
        persons
    )
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})