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
app.use(express.static('public'));

app.listen(3000, () => {
    console.log('APP IS LISTENING ON PORT 3000!')
})

app.get('/', (req, res) => {
    res.redirect('/todos');
})

// this allows us to escape any special characters with a backslash
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
// INDEX
app.get('/todos', async (req, res) => {
    if (req.query.keyword) {   // if there's a query string called keyword then..
        // set the constant (variable) regex equal to a new regular expression created from the keyword 
        // that we pulled from the query string
        const regex = new RegExp(escapeRegex(req.query.keyword), 'gi');
        // query the database for Todos with text property that match the regular expression version of the search keyword
        await Todo.find({ text: regex })
            .then(todos => {
                res.json(todos);
            })
            .catch(err => {
                console.log("ERROR WHILE QUERYING VIA SEARCH BOX")
                console.log(err);
            })

    }
    else {
        await Todo.find({})
            .then(todos => {
                if (req.xhr) {
                    res.json(todos)
                }
                else {
                    res.render('index', { todos })
                }

            })
            .catch(err => {
                console.log(err)
            })
    }
})


// NEW TODO FORM
app.get('/todos/new', (req, res) => {
    res.render('new');
})


// NEW TODO QUERY
app.post('/todos', async (req, res) => {
    const newData = req.body.todo
    await Todo.create(newData)
        .then(todo => {
            res.json(todo)
        })
        .catch(err => {
            console.log("Error while creating new TODO")
            console.log(err)
        })

})

// EDIT FORM
app.get('/todos/:id/edit', async (req, res) => {
    const { id } = req.params
    const todo = await Todo.findById(id)
        .then(todo => {
            res.render('edit', { todo })
        })
        .catch(err => {
            console.log(err)
        })
})


// EDIT
app.put('/todos/:id', async (req, res) => {
    const { id } = req.params
    const { todo } = req.body
    await Todo.findByIdAndUpdate(id, todo, { runValidators: true, new: true })
        .then(todo => {
            res.json(todo)
        })
        .catch(err => {
            console.log("Error while Editing TODO")
            console.log(err)
        })
})

// DELETE
app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params
    await Todo.findByIdAndDelete(id)
        .then(todo => {
            res.json(todo)
        })
        .catch(err => {
            console.log("Error while Deleting TODO")
            console.log(err)
        })

})

