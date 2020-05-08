const express = require('express')
const socket = require('socket.io')
const MongoClient = require('mongodb').MongoClient
var cors = require('cors')
const app = express();

const dbName = 'mychatroom';
const url = 'mongodb://localhost:27017';

app.use(cors())
app.use(express.json())

const server = app.listen(8000, ()=>{
  console.log('Server running on localhost:8000')
})

const client = MongoClient(url, { useUnifiedTopology: true })
const io = socket(server)
client.connect((err)=>{
  console.log('Is connected to the database')
  const db = client.db(dbName)

  app.get('/', (req,res)=>{
    const collectionNames = db.listCollections().toArray((err,items)=>{
      const chatrooms = items.map(item => item.name)
      res.status(200).send(chatrooms)
    })
  })
  app.get('/:id',(req,res)=>{
    const collection = db.collection(req.params.id)
    collection.find({}).toArray((err,docs)=>{
    console.log(docs)
    res.status(200).send(docs)
  })

  })
  app.post('/', (req,res)=>{
    if(req.body.name){
      insertToCollection(db,req.body.name,req.body.text,req.body.room)
      io.emit('sendMsg', {name: req.body.name, text:req.body.text})
      res.status(201).end()
    }else{
      res.status(400).end()
    }
  })


  io.on('connection', (socket)=>{
    console.log('socket is on')
    socket.on('newRoom', (data)=>{
      db.listCollections().toArray((err, items)=>{
        const found = items.find(item => item.name === data.roomName )
        if(found){
          socket.emit('newRoom', {error: true})
          return
        }else{
          createNewRoom(db,data.roomName)
          socket.emit('newRoom', {error: false})
          io.emit('getRooms', data.roomName)
        }
      })
    })
    socket.on('delete', (data)=>{
      deleteRoom(db,data.roomName)
      db.listCollections().toArray((err,items)=>{
        const roomNames = items.map(item => item.name)
        io.emit('getRemainingRooms', roomNames)
      })

    })

  })

})

function createNewRoom(db, roomName){
  const collection = db.collection(roomName)
  collection.insertMany([{}],(err,result)=>{
    collection.deleteMany({})
  })
}
function deleteRoom(db, roomName){
  const collection = db.collection(roomName)
  collection.drop()
}
function insertToCollection(db,name,text, roomName){
  const collection = db.collection(roomName)
  collection.insertOne({name:name, text:text},(err,result)=>{
  })
}
