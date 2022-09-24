const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const path = require('path')

const Todo = require('./models/todo');
// on nodejs ver 17+ need to use 127.0.0.1 instead of localhost
mongoose.connect('mongodb://127.0.0.1:27017/todoApp')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!")
    })
    .catch(err => {
        console.log("OOPS MONGO CONNECTION ERROR!!")
        console.log(err)
    })

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.listen(3000, () => {
    console.log('APP IS LISTENING ON PORT 3000!')
})

app.get('/', (req, res) => {
    res.redirect('/todos');
})


// INDEX
app.get('/todos', async (req, res) => {
    const todos = await Todo.find({})
    res.render('index', { todos })
})


// NEW TODO FORM
app.get('/todos/new', (req, res) => {
    res.render('new');
})


// NEW TODO QUERY
app.post('/todos', async (req, res) => {
    const newTodo = new Todo(req.body.todo)
    await newTodo.save();
    res.redirect('/todos')
})

// EDIT FORM
app.get('/todos/:id/edit', async (req, res) => {
    const { id } = req.params
    const todo = await Todo.findById(id)
    res.render('edit', { todo })
})


// EDIT
app.put('/todos/:id', async (req, res) => {
    const { id } = req.params
    const { todo } = req.body
    await Todo.findByIdAndUpdate(id, todo, { runValidators: true, new: true })
        .then(todo => {
            res.redirect('/todos')
        })
        .catch(err => {
            console.log(err)
        })
})

// DELETE
app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params
    await Todo.findByIdAndDelete(id)
        .then(todo => {
            res.redirect('/todos')
        })
        .catch(err => {
            console.log(err)
        })

})

