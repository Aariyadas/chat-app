import React from 'react'


const SearchUser = ({searchKey,setSearchKey}) => {
   

  return (
    <div className='relative lg:w-96 xl:w-96 md:w-60 sm:w-60 xs:w-40'>
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

export default SearchUser