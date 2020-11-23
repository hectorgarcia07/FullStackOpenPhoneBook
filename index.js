const express = require('express')
var morgan = require('morgan')

const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())

morgan.token('data', (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
    { 
      name: "Arto Hellas", 
      number: "040-123456",
      id: 1
    },
    { 
      name: "Ada Lovelace", 
      number: "39-44-5323523",
      id: 2
    },
    { 
      name: "Dan Abramov", 
      number: "12-43-234345",
      id: 3
    },
    { 
      name: "Mary Poppendieck", 
      number: "39-23-6423122",
      id: 4
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length}</p>
                    <p>${Date()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    persons = persons.filter(person => person.id !== id)
    
    response.json(persons)
})

const RandomId = () => Math.floor(Math.random() * Math.floor(10000000))

app.post('/api/persons', (request, response) => {
  let new_id = RandomId()
  let body = request.body
  let message = ''

  if(!body.name){
    message = "Error: Must contain name."
  }
  if(!body.number){
    message = "Error: Must contain number."
  }
  if(!body.name && !body.number){
    message = "Error: Must contain name and number"
  }
  if(message){
    return response.status(400).json({
      error: message
    })
  }

  if(persons.find(person => person.name === body.name)){
    return response.status(400).json({
      error: 'Name already exist.'
    })
  }
  
  const person = {
    id: new_id,
    name: body.name,
    number: body.number
  }

  persons.concat(person)

  response.json(persons)  
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.listen(3001, () => console.log("Server started"))