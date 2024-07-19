import axios from 'axios';
import React, { useEffect, useState } from 'react';


export default function FriendList({ conversation, currentUser , online }) {

    const PF = import.meta.env.VITE_REACT_APP_PUBLIC_FOLDER;
    const [user, setUser] = useState([]);
    const [latestMessage, setLatestMessage] = useState([]);
   // const [onlines, setOnlines] = useState([]);

    useEffect(() => {
        const getUser = async () => {
            const friendId = conversation.members.find((m) => m !== currentUser._id);
            try {
                const memb = await axios.get("/api/users/" + friendId);
                setUser(memb.data);
            } catch (error) {
                console.log(error);
            }
        }
        getUser();
    }, [currentUser, conversation]);

    useEffect(() => {
        const getLatestMessage = async () => {
            try {
                const msg = await axios.get("/api/messages/last/" + conversation._id);
                setLatestMessage(msg.data);
            } catch (error) {
                console.log(error);
            }
        }
        getLatestMessage();
    }, [conversation]);
//console.log(online);



    return (
        
        <div className='relative'>
            <div className='w-96 h-16 ml-3 mt-5 rounded-lg cursor-pointer bg-gradient-to-r from-gray-800 via-slate-700 to-gray-800 hover:shadow-[0px_1px_23px_0px_#4a5568]'>
                <div className='absolute mt-2 ml-3'>
                    <img src={PF + user.profilePicture} alt="user" className= 'w-12 h-12 object-cover rounded-full p-0 m-0 border-2 border-green-500' />
                </div>
                <p className='absolute mt-2 ml-20 font-bold text-base text-white'>{user.username}</p>
                <div className='relative overflow-hidden'>
                    <p className='mt-8 ml-20 font-light text-sm text-white overflow-hidden whitespace-nowrap'>{latestMessage.text}</p>
                </div>
            </div>
        </div>
       
    );
}
