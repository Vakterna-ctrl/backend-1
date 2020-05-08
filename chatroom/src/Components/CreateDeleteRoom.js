import React from 'react';
import socket from './socket'
import {Link} from 'react-router-dom'
import "../App.css"

function CreateDeleteRoom({room}) {

function deleteRoom(){
  socket.emit('delete', {roomName: room})
}

  return (
    <>
       <div className='roomlists'>
       <p className="roomtext" style={{marginBottom:0}}>{room}</p>
       <Link className="links" to={"/"+room}><button className="createRoom">join room</button></Link>
       <button onClick={deleteRoom} className="delete" >delete</button>
       </div>
    </>



  );
}

export default CreateDeleteRoom;
