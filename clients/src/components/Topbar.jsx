import React, { useContext } from 'react';
import { Settings } from "@mui/icons-material";
import { Logout } from "@mui/icons-material";
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Topbar() {
  const { user, dispatch } = useContext(AuthContext);
  const PF = import.meta.env.VITE_REACT_APP_PUBLIC_FOLDER;
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  }
  const handleUpdate = () => {
    navigate("/update");
  }

  const handleImg = () => {
    navigate("/update");
  }




  return (
    <div className='h-12 w-full bg-gradient-to-r from-slate-900 to-slate-700 flex items-center sticky top-0'>
      <div onClick={handleImg}>
        <img src={PF + user.profilePicture} alt="user2" className=' ml-14 mt-1 w-10 h-10 object-cover rounded-full cursor-pointer' />
      </div>
      <p className=' text-white ml-4 mt-1 font-bold text-base cursor-pointer'>{user.username}</p>

      <div className='absolute right-2 w-32'>
        <Settings className=' text-white ml-6  text-sm cursor-pointer hover:text-blue-600' onClick={handleUpdate} />
        <Logout className=' text-white ml-6 text-sm cursor-pointer hover:text-red-600' onClick={handleLogout} />
      </div>
    </div>
  );
}
