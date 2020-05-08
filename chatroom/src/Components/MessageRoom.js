import React, {useState,useEffect,useRef} from 'react';
import axios from 'axios'
import socket from './socket'
import "../App.css"

function MessageRoom({match}) {
  const [name, updatename] = useState('')
  const [text, updatetext] = useState('')
  const [emptyUsername, updateEmptyUsername] = useState(false)
  const [messages, updatemessages] = useState([])
  const scroll = useRef()

  useEffect(()=>{
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source()
    axios.get(`http://localhost:8000/${match.params.id}`,{cancelToken: source.token})
    .then(response=>{
      updatemessages(response.data)
    })
    return ()=>{
      source.cancel()
    }
  },[match.params.id])

  useEffect(()=>{
    socket.once('sendMsg',(data)=>{
      updatemessages([...messages, data])
    })
    scroll.current.scrollTop = scroll.current.scrollHeight
  },[messages])

  function getName(e){
    updatename(e.target.value)
  }
  function getText(e){
    updatetext(e.target.value)
  }

  function sendMsg(e){
    console.log('been clicked')
    axios.post('http://localhost:8000/',{name:name, text:text, room:match.params.id})
    .then(response=>{
      updateEmptyUsername(false)
    })
    .catch(error =>{
      updateEmptyUsername(true)
    })
    e.preventDefault()
  }

  return (
    <div style={{width:'100%', height:'100%'}}>
    <div ref={scroll} className="messages" style={{height:'70%'}}>
    {messages.map(message => {
      return <div key={message['_id']}><p>{message.name} : {message.text} </p><hr/></div>
    })}
    </div>
    <form  className="sendMessages">
    <div style={{marginRight:'50px', width:'500px'}}>
    <input onChange={getName}  className="username" type="text" placeholder="username" required/>
    <div className={emptyUsername === false ? 'hideWarning' : 'showWarning'}>username is empty</div>
    <textarea onChange={getText} className="textarea">
    </textarea>
    </div>
    <input onClick={sendMsg} className="submitMessage" type="submit" />
    </form>
    </div>

  );
}

export default MessageRoom
