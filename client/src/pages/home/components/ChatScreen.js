import React from 'react'
import { useSelector } from 'react-redux'

const ChatScreen = () => {
  const {selectedChat,user}=useSelector(state=>state.userReducer)
  console.log(selectedChat)
  const receipentUser =selectedChat.members.find(
    (mem) =>mem._id!==user._id
  )
  console.log(receipentUser)
  return (
    <div class="bg-white h-[82vh] border rounded-2xl w-full flex flex-col justify-between p-5">
      {/* 1st part recepient user */}
      <div>
       {receipentUser.name}
      </div>
      {/* 2nd part chat message */}
      <div>
        Chat Message
      </div>
      {/* 3rd part chat input */}
      <div>
        Chat Input
      </div>
    </div>
  )
}

export default ChatScreen