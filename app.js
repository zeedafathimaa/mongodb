const express= require('express');
const {ObjectId}=require('mongodb')
const {connectToDb,getDb}=require('./db')
const app = express();

app.use(express.json());

// connect to database
let db

connectToDb((err)=>{
    if (!err) {
        app.listen(3000,()=>{
            console.log('listening on port 3000')
        })
        db=getDb();
    }
})

// fetching database
app.get('/books', (req,res)=>{
    let books=[]

    db.collection('books')
    .find()
    .sort({author :1})
    .forEach(book =>books.push(book))
    .then(()=>{
        res.status(200).json(books)
    })
    .catch(err =>{
        res.status(500).json({error : 'couldnt fetch documents'})
    })

})

// updating database (using postman to test the code by adding a new book to the database)
app.post('/books', (req,res)=>{
    const book =req.body

    db.collection('books')
    .insertOne(book)
    .then(result =>{
        res.status(201).json(result)
    })
    .catch(err =>{
        res.status(500).json({error : 'couldnt insert document'})
    })
})

// listing database
app.get('/books', (req,res)=>{
    db.collection('books')
   .find()
   .toArray()
   .then(result =>{
        res.status(200).json(result)
    })
})

// updating the fields in the database (using postman to test the code by altering few fields in a new book of a database)
app.patch('/books/:id', (req,res)=>{
    const updates =req.body

    if (ObjectId.isValid(req.params.id)){
        db.collection('books')
        .updateOne({_id : ObjectId(req.params.id)}, {$set: updates})
        .then(result =>{
            res.status(200).json(result)
        })
        .catch(err =>{
            res.status(500).json({error : 'couldnt update document'})
        })
    }else{
        res.status(400).json({error : 'invalid id'})
    }
})

