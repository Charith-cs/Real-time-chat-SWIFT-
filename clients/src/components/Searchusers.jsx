import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import userImg from "../assets/add-user.png";



export default function Searchusers({ getsearchUser, user, setGetSerachUser, setMessages ,  setConUser , currentChat , setCurrentChat }) {
  const PF = import.meta.env.VITE_REACT_APP_PUBLIC_FOLDER;
  const [createChat, setCreateChat] = useState([]);
  //const [currentChat, setCurrentChat] = useState([]);
  //const socket = useRef();

  {/*useEffect(() => {
   // socket.current = io("ws://localhost:8900");
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", users => {
      //console.log(users);
    })
  }, [user]);*/}


  // Function to handle adding a new conversation
  const handleClick = async () => {
    if(!getsearchUser._id){
      console.log("null value");
    }else{
      try {
        const newConversation = {
          senderId: user._id,
          receiverId: getsearchUser._id
        };
  
        const res = await axios.post("/api/conversations", newConversation);
        setCreateChat(res.data);
        setGetSerachUser([]);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    } 
  };

  // Function to handle retrieving an existing conversation
  const handleChat = async () => {
    if(!getsearchUser._id){
      console.log("null value");
    }else{ 
      try {
        const newC = await axios.get("/api/conversations/find/" + user._id + "/" + getsearchUser._id);
        setCurrentChat(newC.data);
        setGetSerachUser([]);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };
  //get messages based on conversation id
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

  // Function to handle sending a friend request
  const handleReq = async () => {
    if(!getsearchUser._id){
      console.log("null value");
    }else{
      try {
        const newFriend = {
          userId: user._id,
          email: getsearchUser.email
        };
        await axios.put("/api/users/add", newFriend);
        setGetSerachUser([]);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };
  console.log(getsearchUser);

  //handle currentchat user deatails

  useEffect(()=>{
    const getUsers = async () => {
      const friendId = currentChat.members.find((m)=>m !== user._id);
      try{
        const res = await axios.get("/api/users/" + friendId);
        setConUser(res.data);
      }catch(error){
        console.log(error);
      }
    }
    getUsers();
  },[user , currentChat]);

  return (

    <div onClick={handleReq} >
      <div onClick={handleChat}>
        <div onClick={handleClick}>
          <div className=' w-72 h-12 ml-12 mt-5 bg-transparent rounded-lg cursor-pointer'>
            <div className='absolute mt-2 ml-3 '><img src={getsearchUser && Object.keys(getsearchUser).length > 0 ? PF + getsearchUser.profilePicture : userImg} alt="" className=' w-8 h-8 object-cover rounded-full p-0 m-0' /></div>
            <p className=' absolute mt-2 ml-20 font-bold text-base text-white '>{getsearchUser && Object.keys(getsearchUser).length > 0 ? getsearchUser.username : "Search user for add"}</p>
          </div>
        </div>
      </div>
    </div >

  );
}
