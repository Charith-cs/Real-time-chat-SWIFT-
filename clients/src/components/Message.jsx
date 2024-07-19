import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import {format} from "timeago.js";

export default function Message({own, conversation , message}) {

    const {user} = useContext(AuthContext);




    return (
        <div className={own ? 'h-full pr-0 ml-10 mt-3 absolute right-12':'h-full pr-10 ml-10 mt-3'}>
            <div className=' flex'>
                <div className={ own ? 'pt-2 pb-2 pl-4 pr-4 rounded-t-2xl rounded-bl-2xl bg-gradient-to-r from-slate-600 to-slate-800 text-white max-w-[300px] ' : 'pt-2 pb-2 pl-4 pr-4 rounded-t-2xl rounded-br-2xl bg-gradient-to-r from-blue-800 to-indigo-900 text-white max-w-[300px]'} >
                    <p>{message.text}</p>
                </div>
            </div>
            <div className={own ? 'text-xs mt-1 ml-1 text-white absolute right-0 w-16 max-w-20' : 'text-xs mt-1 ml-1 text-white'}>{format(message.createdAt)}</div>
        </div>
    )
}
