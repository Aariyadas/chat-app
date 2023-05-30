import React from 'react'
import { useNavigate } from 'react-router-dom';

const UserSearch = ({searchKey,setSearchKey}) => {
    const navigate = useNavigate();

  return (
    <div className='relative'>
        <input type='text' placeholder='Search chats'
        className='rounded-full w-full pl-10 text-gray-500'
        value={searchKey}
        onChange={(e)=>setSearchKey(e.target.value)}
        />
        <i class='ri-search-2 absolute top-2 left-4 text-gray-500'
       ></i>
    </div>
  )
}

export default UserSearch