import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiSendPlaneLine } from "react-icons/ri";
import { SendMessage } from "../../../apiCalls/messageapi";
import { HideLoader, ShowLoader } from "../../../redux/loaderSlice";
import { toast } from "react-hot-toast";

const ChatScreen = () => {
  const dispatch=useDispatch();
  const [newMessage,setNewMessages] =React.useState("")
  const { selectedChat, user } = useSelector((state) => state.userReducer);
  console.log(selectedChat);
  const receipentUser = selectedChat.members.find(
    (mem) => mem._id !== user._id
  );
  const sendNewMessage =async() =>{
    try{
      dispatch(ShowLoader())
   const message ={
    chat:selectedChat._id,
    sender:user._id,
    text:newMessage,

   }
   const  response=await SendMessage(message)
   dispatch(HideLoader())
   if(response.success){
    setNewMessages("")
   }
    }catch(error){
     dispatch(HideLoader())
     toast.error(error.message)
    }
  }
  console.log(receipentUser);
  return (
    <div className="bg-white h-[82vh] border rounded-2xl w-full flex flex-col justify-between p-5">
      {/* 1st part recipient user */}
      <div>
        <div className="flex gap-5 items-center mb-2">
          {receipentUser.profilePic && (
            <img
              src={receipentUser.profilePic}
              alt="profile pic"
              className="w-10 h-10 rounded-full"
            />
          )}
          {!receipentUser.profilePic && (
            <div className="bg-gray-500 rounded-full h-10 w-10 flex items-center justify-center">
              <h1 className="uppercase text-white text-xl font-semibold">
                {receipentUser.name[0]}
              </h1>
            </div>
          )}

          <h1 className="uppercase">{receipentUser.name}</h1>
        </div>
        <hr />
      </div>
      {/* 2nd part chat message */}
      <div>Chat Message</div>
      {/* 3rd part chat input */}
      <div className="h-18 rounded-xl border-gray-300 shadow border flex flex-col sm:flex-row justify-between p-2 items-center">
        <input
          type="text"
          placeholder="Type a message"
          className="w-full sm:w-[90%] border-0 h-full rounded-xl sm:mr-2 focus:border-none"
          value={newMessage}
          onChange={(e)=>setNewMessages(e.target.value)}
        />
        <button className="bg-black text-white py-1 px-5 rounded h-max mt-2 sm:mt-0 sm:w-auto"
        onClick={sendNewMessage}>
          <RiSendPlaneLine className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;
