import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { HideLoader, ShowLoader } from "../../../redux/loaderSlice";
import { CreateNewChat } from "../../../apiCalls/chatapi";
import { SetAllChats, SetSelectedChat } from "../../../redux/userSlice";
import moment from "moment";
import store from "../../../redux/store";

const UserList = ({ searchKey ,socket}) => {
  const { allUsers, allChats, user, selectedChat } = useSelector(
    (state) => state.userReducer
  );
  const dispatch = useDispatch();

  const createNewChat = async (receipentUserId) => {
    try {
      dispatch(ShowLoader());
      const response = await CreateNewChat([user._id, receipentUserId]);
      dispatch(HideLoader());
      if (response.success) {
        toast.success(response.message);
        const newChat = response.data;
        const updatedChats = [...allChats, newChat];
        dispatch(SetAllChats(updatedChats));
        dispatch(SetSelectedChat(newChat));
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
    }
  };
  const openChat = (receipentUserId) => {
    const chat = allChats.find(
      (chat) =>
        chat.members.map((mem) => mem._id).includes(user._id) &&
        chat.members.map((mem) => mem._id).includes(receipentUserId)
    );
    if (chat) {
      dispatch(SetSelectedChat(chat));
    }
  };

  const getData = () => {
    if (searchKey === " ") {
      return allChats;
    }
    return allUsers.filter((user) =>
      user.name.toLowerCase().includes(searchKey.toLowerCase())
    );
  };

  const getIsSelectedChatOrNot = (userObj) => {
    if (selectedChat) {
      return selectedChat.members.map((mem) => mem._id).includes(userObj._id);
    }
    return false;
  };

  const getUnreadMessages = (userObj) => {
    const chat = allChats.find((chat) =>
      chat.members.map((mem) => mem._id).includes(userObj._id)
    );
    if (
      chat &&
      chat?.unreadMessages &&
      chat?.lastMessage?.sender !== user._id
    ) {
      return (
        <div className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {chat?.unreadMessages}
        </div>
      );
    }
  };

  const getLastMsg = (userObj) => {
    const chat = allChats.find((chat) =>
      chat.members.map((mem) => mem._id).includes(userObj._id)
    );
    if (!chat || !chat.lastMessage) {
      return " ";
    } else {
      const lastMessagePerson =
        chat?.lastMessage?.sender === user._id ? "You :" : "";
      return (
        <div className="flex justify-between w-72 ">
          <h1 className="text-gray-700 text-s">
            {lastMessagePerson} {chat?.lastMessage?.text}
          </h1>
          <h1 className="text-gray-500 text-sm justify-right">
            {moment(chat?.lastMessage?.createdAt).format("hh:mm:A")}
          </h1>
        </div>
      );
    }
  };

 useEffect(()=>{
  socket.on("receive-message",(message)=>{
    const tempSelectedChat =store.getState().userReducer.selectedChat;
    const tempAllChats=store.getState().userReducer.allChats;
    if(tempSelectedChat?._id !== message.chat){
     const updatedChats =tempAllChats.map((chat)=>{
      if(chat._id === message.chat){
        return {
          ...chat,
          unreadMessages:(chat?.unreadMessages ||0)+1,
          lastMessage:message
        }
      }
      return chat;
     });
     dispatch(SetAllChats(updatedChats))
    }
  })
 },[])


  return (
    <div className="flex flex-col gap-3 mt-5 w-96">
      {getData().map((chatObjOrUserObj) => {
        let userObj = chatObjOrUserObj;
        if (chatObjOrUserObj.members) {
          userObj = chatObjOrUserObj.members.find(
            (mem) => mem._id !== user._id
          );
        }
        return (
          <div
            className={`"shadow-sm border p-3 rounded-2xl bg-white flex justify-between items-center cursor-pointer w-full "
            ${getIsSelectedChatOrNot(userObj) && "border-primary border-2"}
            `}
            key={userObj._id}
            onClick={() => openChat(userObj._id)}
          >
            <div className="flex gap-5 items-center  ">
              {userObj.profilePic && (
                <img
                  src={userObj.profilePic}
                  alt="profile pic"
                  className="w-10 h-10 rounded-full"
                />
              )}
              {!userObj.profilePic && (
                <div className="bg-gray-500 rounded-full h-12 w-12  flex items-center justify-center">
                  <h1 className="uppercase text-white text-xl font-semibold">
                    {userObj.name[0]}
                  </h1>
                </div>
              )}
              <div className="flex flex-col gap-1 ">
                <div className="flex gap-1 ">
                  <h1>{userObj.name}</h1>

                  {getUnreadMessages(userObj)}
                </div>
                <h1 className="text-gray-500 text-sm">
                  {getLastMsg(userObj)}
                  </h1>
              </div>
            </div>
            <div onClick={() => createNewChat(userObj._id)}>
              {!allChats.find((chat) =>
                chat.members.map((mem) => mem._id).includes(userObj._id)
              ) && (
                <button className="bg-white px-3 py-1   border border-black text-primary p-1 rounded ">
                  Start New Chat
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserList;
