import React, { useContext, useEffect, useRef, useState } from 'react';
import FriendList from './friendList';
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";
import Message from './Message';
import { MoreHoriz , Block , EmojiPeople } from '@mui/icons-material';
import { AddLink } from "@mui/icons-material";
import bg from "../assets/bg.jpg";
import Searchusers from './Searchusers';
import { io } from "socket.io-client";
import { Dropdown } from 'flowbite-react';

export default function Sidebar() {

  const { user } = useContext(AuthContext);
  const PF = import.meta.env.VITE_REACT_APP_PUBLIC_FOLDER;
  const [conversation, setConversation] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [conUser, setConUser] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchUser, setSerachUser] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [getsearchUser, setGetSerachUser] = useState([]);
  const [online, setOnline] = useState(false);;
  const scrollRef = useRef();
  const socket = useRef();

  useEffect(() => { 
    socket.current = io("ws://localhost:8900"); 
    socket.current.on("getMessage", data => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now()
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", users => {
      setOnline(users);
    })
  }, [user]);


  //get relevent conversation deatails based on current chat
  useEffect(() => {
    const getUser = async () => {

      const friendId = currentChat.members.find((m) => m !== user._id);
      try {
        const memb = await axios.get("/api/users/" + friendId);
        setConUser(memb.data);
      } catch (error) {
        console.log(error);
      }
    }
    getUser();
    console.log(user);
  }, [user, currentChat]);

  //get conversations(friends)
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/api/conversations/" + user._id);
        setConversation(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getConversations();
  }, [user]);

  //get messages
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("/api/messages/" + currentChat._id);
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getMessages();
  }, [currentChat]);


  //send message
  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      conversationId: currentChat._id,
      sender: user._id,
      text: newMessage
    }

    const receiverId = currentChat.members.find(member => member !== user._id);

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId: receiverId,
      text: newMessage
    });

    try {
      const res = await axios.post("/api/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };


  //scroll latest
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  //search and add option

  const handleKeyPress = () => {
    if (event.key === 'Enter') {
      handleSearch();
      setSerachUser("");
    }
  };

  const handleSearch = async () => {
    let newsearchUser = {};
    if (searchUser.includes('@gmail.com')) {
      newsearchUser = {
        email: searchUser
      }
    } else {
      newsearchUser = {
        username: searchUser
      }
    }

    try {
      const res = await axios.post("/api/users/search/" + user._id, newsearchUser);
      setGetSerachUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  //create conversation based on search result

  //connection disconnection status
  {/**socket.current.on('status', (isConnected) => {
  if(isConnected){
    setOnline(true);
    console.log(online);
  }else{
    setOnline(false);
    console.log(online);
  }
}); */}

//handel unfriend function
const handelUnfriend = async () => {
  try{
    const unfriend = currentChat.members.find(member => member !== user._id);
    await axios.delete("/api/conversations/delete/" + user._id + "/" + unfriend);
    await axios.delete("/api/messages/delete/" + messages[0].conversationId);
    window.location.reload();
    //console.log(messages[0].conversationId);
  }catch(error){
    console.log(error);
  }
};


  return (
    <>
      {/**sidebar */}
      <div className='flex-3 w-1/3 h-[calc(100vh-48px)] overflow-y-scroll sticky top-14 bg-gradient-to-b from-slate-900 to-slate-700'>
        <div className=' p-8'>

          <div className="relative ml-3 h-11 w-96  min-w-[200px] items-center justify-center">
            <input
              placeholder=""
              className="peer h-full w-full text-white border-b border-white bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-blue-800 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
              value={searchUser}
              onChange={(e) => { setSerachUser(e.target.value) }}
              onKeyUp={handleKeyPress}
            />
            <label
              className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-white transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-blue-800 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-white peer-focus:after:scale-x-100 peer-focus:after:border-blue-800 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              Search or start a new chat
            </label>

            <Searchusers
              getsearchUser={getsearchUser}
              user={user}
              setGetSerachUser={setGetSerachUser}
              setMessages={setMessages}
              currentChat={currentChat}
              setCurrentChat={setCurrentChat}
              setConUser={setConUser}

            />

          </div>
          <div className=' mt-20'>
            {conversation.map((c) => (
              <div key={c._id} onClick={() => setCurrentChat(c)} >
                <FriendList 
                conversation={c} 
                currentUser={user}
                //online = {online} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>


      {/**chat space */}
      {currentChat ?
        <div className='flex-grow-3.5 w-2/3 h-[calc(100vh-112px)] overflow-y-scroll sticky top-14  bg-gradient-to-tr from-stone-900 via-stone-500 to-blue-700'>

          <div className=' w-full h-16 bg-gradient-to-r from-slate-800 to-slate-600 rounded-b-lg fixed z-10 top-12'>
            <img src={PF + conUser.profilePicture} alt="user1" className=' w-12 h-12 object-cover rounded-full ml-8 absolute mt-2  cursor-pointer' />
            <p className=' font-bold text-lg text-white ml-24 absolute mt-4'>{conUser.username}</p>

            <div className='fixed right-12 mt-5 text-white'>  
              <Dropdown className='bg-gray-700'  inline>
                {/*<Dropdown.Item className=' text-white hover:text-gray-600'>Deatails<EmojiPeople className=' w-5 h-5'/></Dropdown.Item>*/}
                <div onClick={handelUnfriend}>
                <Dropdown.Item className=' text-white hover:text-red-600'>Unfriend<Block className=' w-5 h-5' /></Dropdown.Item>
                </div>
              </Dropdown>
            </div>

          </div>
          {messages.map((m) => (
            <div className='relative flex flex-col justify-between mt-20 mb-16'>
              <div className='h-full  pr-10'>


                <div key={m._id} ref={scrollRef}>
                  <Message message={m} own={m.sender === user._id} conversation={currentChat} />
                </div>


              </div>
            </div>
          ))}

          <div className=' w-full h-14 bg-gradient-to-r from-slate-900 to-slate-700 bottom-0 fixed'>
            <input
              placeholder='Type a message ...'
              className=' w-2/4 mt-3  ml-10 p-1 pl-5 rounded-lg focus:border-none'
              onChange={(e) => { setNewMessage(e.target.value) }}
              value={newMessage}
              
            />
            <input type="file" className=' hidden' id='file' />
            <label htmlFor='file'><AddLink className=' ml-8 mb-1 text-white hover:text-blue-600 cursor-pointer' /></label>
            <button type="submit"  onClick={handleSend} className="ml-8 text-white bg-gradient-to-r from-blue-800 to-indigo-900 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Send</button>
          </div>

        </div>
        :
        <div className='flex-grow-3.5 w-2/3 h-[calc(100vh-48px)] overflow-hidden sticky top-14 bg-gray-800 '>
          <span className='text-white text-4xl absolute mt-72 ml-48 -z-1'>Open a conversation to start a chat 😻</span>
          <img src={bg} alt="bg" className='rounded-lg opacity-10' />
        </div>

      }
    </>
  )
}
