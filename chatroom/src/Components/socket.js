import io from 'socket.io-client'
const URL = 'localhost:8000'
const socket = io.connect(URL)
export default socket
