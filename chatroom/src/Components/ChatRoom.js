import React, {useState,useEffect} from 'react';
import axios from 'axios'
import socket from './socket'
import CreateDeleteRoom from './CreateDeleteRoom'
import "../App.css"

const URL = 'http://localhost:8000/'
function ChatRoom() {
  const [room, updateRooms] = useState([])
  useEffect(()=>{
  axios.get(URL)
  .then((data)=>{
    updateRooms(data.data)
  })
  },[])

  useEffect(()=>{
      socket.once('getRooms', (data)=>{
        updateRooms([ ...room, data])
      })
      socket.once('getRemainingRooms', (data)=>{
        updateRooms(data)
      })
    },[room])

  return (
    <div style={{width:'100%'}}>
    <h1 style={{textAlign: 'center'}}>Chatroom</h1>
    <hr/>
    <ul>
    {room.map((room, id) =>(
       <li key={id}>
       <CreateDeleteRoom room={room}/>
       <hr/>
       </li>

    ))}
    </ul>
    </div>


  );
}

export default ChatRoom;
