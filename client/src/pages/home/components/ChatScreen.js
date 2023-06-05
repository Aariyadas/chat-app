import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiSendPlaneLine } from "react-icons/ri";
import { GetMessages, SendMessage } from "../../../apiCalls/messageapi";
import { HideLoader, ShowLoader } from "../../../redux/loaderSlice";
import { toast } from "react-hot-toast";
import moment from "moment";
import store from "../../../redux/store";
import { ClearChatMessage } from "../../../apiCalls/chatapi";
import { SetAllChats } from "../../../redux/userSlice";

const ChatScreen = ({ socket }) => {
  const dispatch = useDispatch();
  const [newMessage, setNewMessages] = React.useState("");
  const { selectedChat, user, allChats } = useSelector(
    (state) => state.userReducer
  );
  const [messages = [], setMessages] = React.useState([]);
  console.log(selectedChat);
  const receipentUser = selectedChat.members.find(
    (mem) => mem._id !== user._id
  );
  const sendNewMessage = async () => {
    try {
      const message = {
        chat: selectedChat._id,

        sender: user._id,
        text: newMessage,
      };
      // Sending message to server using socket
      socket.emit("send-message", {
        ...message,
        members: selectedChat.members.map((mem) => mem._id),
        createdAt: moment().format("DD-MM-YYYY hh:mm:ss"), // Fix: Corrected the format
        read: false,
      });
      // sending and storing data in db
      const response = await SendMessage(message);

      if (response.success) {
        setNewMessages("");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  console.log(receipentUser);

  const getMessages = async () => {
    try {
      dispatch(ShowLoader());
      const response = await GetMessages(selectedChat._id);
      dispatch(HideLoader());
      if (response.success) {
        setMessages(response.data);
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
    }
  };

  const clearUnreadMessages = async () => {
    try {
      socket.emit("clear-unread-messages", {
        chat: selectedChat._id,
        members: selectedChat.members.map((mem) => mem._id),
      });

      const response = await ClearChatMessage(selectedChat._id);

      if (response.success) {
        const updatedChats = allChats.map((chat) => {
          if (chat._id === selectedChat._id) {
            return response.data;
          }
          return chat;
        });
        console.log(updatedChats);
        dispatch(SetAllChats(updatedChats));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getMessages();
    if (selectedChat?.lastMessage?.sender !== user._id) {
      clearUnreadMessages();
    }
    // receive message from server using socket
    socket.off("receive-message").on("receive-message", (message) => {
      const tempSelectedChat = store.getState().userReducer.selectedChat;
      if (tempSelectedChat._id === message.chat) {
        setMessages((messages) => [...messages, message]);
      }
      if (
        tempSelectedChat._id === message.chat &&
        message.sender !== user._id
      ) {
        clearUnreadMessages();
      }
    });

    socket.on("unread-messages-clear", (data) => {
      const tempAllChats = store.getState().userReducer.allChats;
      const tempSelectedChat = store.getState().userReducer.selectedChat;
      if (data.chat === tempSelectedChat._id ) {
        const updatedChats = tempAllChats.map((chat) => {
          if (chat._id === data.chat) {
            return {
              ...chat,
              clearUnreadMessages: 0,
            };
          }
          return chat;
        });
        dispatch(SetAllChats(updatedChats));

        // set all messages as read
        setMessages(prevMessages=>{
          return prevMessages.map(messages=>{
            return{
              ...messages,
              read:true
            }
          })
        })
        
      }
    });
  }, [selectedChat]);

  useEffect(() => {
    // always scroll to bottom For messages
    const messagesContainer = document.getElementById("messages");
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, [messages]);

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
      <div className="h-[55vh] overflow-y-scroll p-5" id="messages">
        <div className="flex flex-col gap-2">
          {messages.map((message) => {
            const isCurrentUserIsSender = message.sender === user._id;

            return (
              <div className={`flex ${isCurrentUserIsSender && "justify-end"}`}>
                <div className="flex flex-col gap-1">
                  <h1
                    className={`${
                      isCurrentUserIsSender
                        ? "bg-primary text-white rounded-bl-none"
                        : "bg-gray-300 text-primary rounded-tr-none"
                    }
                   p-2 rounded-xl `}
                  >
                    {message.text}
                  </h1>
                  <h1 className="text-gray-500 text-sm">
                    {moment(message.createdAt).format("hh:mm A")}
                  </h1>
                </div>
                <div>
                  {isCurrentUserIsSender && (
                    <i
                      className={`ri-check-double-line text-lg p-1
                    ${message.read ? "text-green-400" : "text-gray-400"}
                 `}
                    ></i>
                  )}
                </div>
              </div>
            );
          })}
          :
        </div>
      </div>
      {/* 3rd part chat input */}
      <div className="h-18 rounded-xl border-gray-300 shadow border flex flex-col sm:flex-row justify-between p-2 items-center">
        <input
          type="text"
          placeholder="Type a message"
          className="w-full sm:w-[90%] border-0 h-full rounded-xl sm:mr-2 focus:border-none"
          value={newMessage}
          onChange={(e) => setNewMessages(e.target.value)}
        />
        <button
          className="bg-black text-white py-1 px-5 rounded h-max mt-2 sm:mt-0 sm:w-auto"
          onClick={sendNewMessage}
        >
          <RiSendPlaneLine className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;
