import React, { useEffect } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

import UserList from "./components/UserList";
import ChatScreen from "./components/ChatScreen";
import UserSearch from "./components/UserSearch";

const socket = io("http://localhost:5000");
const Home = () => {


  const [searchKey, setSearchKey] = React.useState("");
  const { selectedChat, user } = useSelector((state) => state.userReducer);

  useEffect(() => {
    if (user) {
      socket.emit("join-room", user._id);
      

    }
  }, [user]);

  return (
    <div className="flex gap-5">
      {/* user Search Chat List */}
      <div className="w-96">
        <UserSearch serachKey={searchKey} setSearchKey={setSearchKey} />
        <UserList searchKey={searchKey} />
      </div>
      {/* 2nd Part Chat Area */}

      {selectedChat && (
        <div className="w-full">
          <ChatScreen socket={socket} />
        </div>
      )}
    </div>
  );
};

export default Home;
