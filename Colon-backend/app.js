import { initializeApp } from "firebase/app";
import { getFirestore,collection, getDocs,addDoc } from 'firebase/firestore';
import express from "express";
import { createServer } from "http";
import {Server} from "socket.io";
import { async } from "@firebase/util";
const app = express()
const server = createServer(app)
const io = new Server(server,{
    cors:{
        origin:'*',
        methods:['GET','POST']
    }
})


const activeUsers = {}
const msgs = {}
const newMsgs = {}

const firebaseConfig = {
  apiKey: "AIzaSyAJ9_IEphUAszaf_WI3tT75YEQcM0Ij-tE",
  authDomain: "angular-7bf43.firebaseapp.com",
  databaseURL: "https://angular-7bf43-default-rtdb.firebaseio.com",
  projectId: "angular-7bf43",
  storageBucket: "angular-7bf43.appspot.com",
  messagingSenderId: "878121635146",
  appId: "1:878121635146:web:ca82ef55f7def61a9c45b3"
};

const firebase = initializeApp(firebaseConfig);
const db =  getFirestore(firebase)

app.get('/',async (req,res)=>{
    
    res.send("send")
})


async function getMessages(roomID) {
    let chats = []
    const chatsCol = collection(db,`Chats/2023/${roomID}`);
    const docs = await getDocs(chatsCol)
    docs.forEach((doc)=>{
        chats.push(doc.data());
    })
    return chats
  }
  

async function addMessages(roomID,data){
    const chatsCol =  collection(db,`Chats/2023/${roomID}`)
    const res = await addDoc(chatsCol,data)
    // console.log(res);
}

io.on('connection',(socket)=>{
    console.log("Socket Connected",socket.id);
    socket.emit('connection',{msg:"Hello there"})
    socket.on('user-online',(data)=>{
        activeUsers[socket.id] = data.id
        console.log(activeUsers);
        socket.emit('active-users',activeUsers)
    })

    socket.on('room-connect',async(roomID)=>{
        socket.join(roomID)
        // console.log(roomID);
        if(msgs[roomID]==null)
            msgs[roomID] = await getMessages(roomID)
        console.log('connected room ',roomID);
        console.log('msgs ',msgs[roomID]);
        socket.emit('all-msg',msgs[roomID])
    })

    socket.on('send-msg',(msg,roomID)=>{
        console.log(msg);
        if(newMsgs[roomID]==null){
            newMsgs[roomID] = [msg]
        }else{
            newMsgs[roomID] = [...newMsgs[roomID],msg]
        }
        socket.to(roomID).emit('receive-msg',msg)
    })

    socket.on('room-disconnect',(roomID)=>{
        if(newMsgs[roomID]==null){
            return
        }
        newMsgs[roomID].map((data)=>{
            addMessages(roomID,data)
        })
        newMsgs[roomID] = null
        msgs[roomID] = null
        console.log('disconnected room ',roomID);
    })

    socket.on('disconnect',()=>{
        console.log("disconnected",socket.id);
        delete activeUsers[socket.id]
    })
})

server.listen(3000,()=>{
    console.log("Listening in port 3000");
})