import AriaModal from 'react-aria-modal'
import React from 'react';
import socket from './socket'


class CreateRoom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalActive: false,
      hideText: false,
      roomName: ''
    };
  }

  activateModal = () => {
    this.setState({ modalActive: true });
  };

  deactivateModal = () => {
    this.setState({ modalActive: false });
    this.setState({hideText: false})
  };
  newInputValue = (e) =>{
    this.setState({roomName: e.target.value})

  }
  createRoomAction = (e) =>{
    e.preventDefault()
    socket.emit('newRoom',{
      roomName: this.state.roomName
    })
    socket.once('newRoom', (data)=>{
      console.log(data)
      if(data.error === true){
        this.setState({hideText: true})
      }else{
        console.log('cl0se')
        this.setState({ modalActive: false });
      }
    })
  }


  render() {
    const modal = this.state.modalActive
      ? <AriaModal
          titleText="Create Room"
          onExit={this.deactivateModal}
          initialFocus="#demo-one-deactivate"
          underlayStyle={{ paddingTop: '6em' }}
        >
          <div id="demo-one-modal" className="modal">
          <div className="CreateRoomWindow">
          <p className="CreateRoomText">Room name</p>
          <form style={{display:'flex', justifyContent:'center'}}>
          <div>
          <input id="demo-one-deactivate" onChange={this.newInputValue} type="text" required />
          <div className={this.state.hideText? 'showError':'noShowError'}>roomname already exist</div>
          </div>
          <div className="CreateRoomButtons">
              <input type="submit" onClick={this.createRoomAction} value="create room"/>
              <button id="cancel" onClick={this.deactivateModal}>
              Cancel
              </button>
          </div>
          </form>
          </div>
          </div>
        </AriaModal>
      : false;

    return (
      <div>
        <p style={{color: 'white', marginTop:'40px'}} onClick={this.activateModal}>Create Room</p>
        {modal}
      </div>
    );
  }
}

export default CreateRoom
