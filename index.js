
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')


morgan.token('body', function (req, res) {
  return JSON.stringify(req.body)
})


app.use(cors())
app.use(express.json())
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`))
app.use(express.static('build'));


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



// generate random Id
function generateId() {
  return Math.floor(Math.random() * 2000);
}

app.get('/', (req, res) => {
  res.send('Hello world!')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// show time and date for request is made
app.get('/info', (req, res) => {
  res.send(`Phonebook has info for ${persons.length} people 
  <br/> 
  ${Date()}
  `)
})

// View specific person
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).send('Person not found!').end()
  }
})


// New phonebook entry
app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Name or Number missing!'
    })
  } else if (persons.find(p => p.name === body.name)) {
    return res.status(406).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  res.json(persons)
})

// Delete person
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})



app.listen(3002, () => {
  console.log('Listening on PORT 3002!')
})