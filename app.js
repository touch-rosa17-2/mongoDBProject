const express = require('express')
const { connectToDb, getDb} = require('./db')
const { ObjectId } = require('mongodb')

//init app & middleware
const app = express()
app.use(express.json())

//db connection
let db
connectToDb(()=>{})

connectToDb((err)=>{
    if(!err){
        app.listen(3000, ()=>{
            console.log('App listening on port 3000')
        })
        db=getDb()
    }
})

//routes
app.get('/books', (req, res)=>{
    let books = []

    db.collection('books')
        .find() //cursor to Array forEach
        .sort({ author: 1 })
        .forEach(book=> books.push(book))
        .then(()=>{
            res.status(200).json(books)
        })
        .catch(()=>{
            res.status(500).json({error: 'Culd not fetch the documents'})
        })
})
app.get('/books/:id', (req, res)=>{
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
            .findOne({_id: ObjectId(req.params.id)}) //cursor to Array forEach
            .then(doc =>{
                res.status(200).json(doc)
            })
            .catch(err=>{
                res.status(500).json({error: 'Could not fetch the document'})
            })
    }
    else{
        res.status(500).json({error: 'Not a valid doc id'})
    }
})

app.post('/books', (req, res) =>{
    const book = req.body

    db.collection('books')
        .insertOne(book)
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({err: 'Could not create new document'})
        })


})