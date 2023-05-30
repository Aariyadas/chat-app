import React from 'react'

import ChatScreen from './components/ChatScreen'
import UserSearch from './components/UserSearch'
import UserList from './components/UserList'

const Home = () => {
  const[searchKey ,setSearchKey] =React.useState("")
  return (
    <div className='flex gap-5'>
      {/* user Search Chat List */}
      <div className='w-96'>
   <UserSearch/>
      </div>
      {/* 2nd Part Chat Area */}
      <div>
        <ChatScreen
        searchKey={searchKey}
        setSearchKey={setSearchKey}
        />
        <UserList
        searchKey={searchKey}/>

      </div>

    </div>

  )
}

export default Home