import React from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { HideLoader, ShowLoader } from "../../../redux/loaderSlice";
import { CreateNewChat } from "../../../apiCalls/chatapi";
import { SetAllChats, SetSelectedChat } from "../../../redux/userSlice";

const UserList = ({ searchKey }) => {
  const { allUsers, allChats, user } = useSelector(
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
        dispatch(SetSelectedChat(newChat))
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
        chat.members.includes(user._id) && chat.members.includes(receipentUserId)
    );
    if (chat) {
      dispatch(SetSelectedChat(chat));
    }
  };
  

  return (
    <div className="flex flex-col gap-3 mt-5">
      {allUsers
        .filter(
          (userObj) =>
            (userObj.name.toLowerCase().includes(searchKey.toLowerCase()) &&
              searchKey) ||
            allChats.some((chat) => chat.members.includes(userObj._id))
        )
        .map((userObj) => {
          return (
            <div className="shadow-sm border p-5 rounded-2xl bg-white flex justify-between items-center"
            key={userObj._id}
          onClick={()=>openChat(userObj._id)} >
              <div className="flex gap-5 items-center">
                {userObj.profilePic && (
                  <img
                    src={userObj.profilePic}
                    alt="profile pic"
                    className="w-10 h-10 rounded-full"
                  />
                )}
                {!userObj.profilePic && (
                  <div className="bg-gray-500 rounded-full h-10 w-10 flex items-center justify-center">
                    <h1 className="uppercase   text-white text-2xl font-semibold">
                      {userObj.name[0]}
                    </h1>
                  </div>
                )}

                <h1>{userObj.name}</h1>
              </div>
              <div onClick={() => createNewChat(userObj._id)}>
                {!allChats.find((chat) =>
                  chat.members.includes(userObj._id)
                ) && (
                  <button className="bg-white px-3 py-1   border border-black text-primary p-1 rounded">
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
