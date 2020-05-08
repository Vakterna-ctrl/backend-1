import React from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom'
import ChatRoom from './Components/ChatRoom'
import CreateRoom from './Components/CreateRoom'
import MessageRoom from './Components/MessageRoom'
import "./App.css"


function App() {

  return (
    <Router>
    <div className="App">
    <div className="CreateRoom">
    <CreateRoom/>
    </div>
    <div className="ChatContent">
    <Route exact path="/" component={ChatRoom} />
    <Route path="/:id" component={MessageRoom}/>
    </div>
    <div className="Users">
    </div>
    </div>
    </Router>


  );
}

export default App;
