import React, { useEffect } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";



import UserList from "./components/UserList";
import ChatScreen from "./components/ChatScreen";
import SearchUser from "./components/SearchUser";

const socket = io("https://lets-chat.onrender.com");
localStorage.setItem("socket", socket);
const Home = () => {
  const [searchKey, setSearchKey] = React.useState("");
  const { selectedChat, user } = useSelector((state) => state.userReducer);
  const [onlineUsers, setOnlineUsers] = React.useState([]);
  useEffect(() => {
    if (user) {
      socket.emit("join-room", user._id);
      socket.emit("came-online", user._id);

      socket.on("online-users", (users) => {
        setOnlineUsers(users);
      });
    }
  }, [user]);

  return (
    <div className="flex gap-5">
      {/* user Search Chat List */}
      <div className="w-96">
        <SearchUser serachKey={searchKey} setSearchKey={setSearchKey} />
        <UserList
          searchKey={searchKey}
          socket={socket}
          onlineUsers={onlineUsers}
        />
      </div>
      {/* 2nd Part Chat Area */}

      {selectedChat && (
        <div className="w-full">
          <ChatScreen socket={socket} />
        </div>
      )}
      {!selectedChat && (
        <div className="w-full h-[75vh] items-center justify-center flex bg-white  flex-col">
          <img
            src="https://www.pngmart.com/files/16/Speech-Chat-Icon-Transparent-PNG.png"
            alt=""
            className="w-96 h-96"
          />
          <h1 className="text-2xl font-semibold text-gray-500">
            Select a user to chat !!!{" "}
          </h1>
        </div>
      )}
    </div>
  );
};

export default Home;
