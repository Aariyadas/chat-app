import React from 'react'


const UserSearch = ({searchKey,setSearchKey}) => {
   

  return (
    <div className='relative'>
        <input type='text' placeholder='Search chats'
        className='rounded-xl w-full pl-10 text-gray-500 h-14'
        value={searchKey}
        onChange={(e)=>setSearchKey(e.target.value)}
        />
        <i class='ri-search-2-line absolute top-4 left-4 text-gray-500'
       ></i>
    </div>
  )
}

export default UserSearch