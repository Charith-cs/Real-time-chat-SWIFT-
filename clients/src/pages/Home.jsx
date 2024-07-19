import React from 'react';
import Topbar from "../components/Topbar";
import Sidebar from '../components/Sidebar';


export default function Home() {
  return (
    <>
    <Topbar/>
    <div className='flex w-full'>
    <Sidebar/>
    
    </div>
  </>
  )
}
