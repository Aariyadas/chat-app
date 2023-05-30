import React, { useEffect } from "react";
import { GetAllUsers, GetCurrentUser } from "../apiCalls/userapi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { HideLoader, ShowLoader } from "../redux/loaderSlice";
import { SetUser ,SetAllUsers} from "../redux/userSlice";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getCurrentUser = async () => {
    try {
      dispatch(ShowLoader());
      const response = await GetCurrentUser();
      const allUsersResponse =await GetAllUsers()
      dispatch(HideLoader());
      if (response.success) {
        dispatch(SetUser(response.data));
        dispatch(SetAllUsers(allUsersResponse.data))
      } else {
        toast.error(response.message);
        navigate("/login");
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCurrentUser();
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className="min-h-screen min-w-screen bg-gray-100 p-2">
      {/* Header */}
      <div className="flex justify-between p-5">
        <div className="flex items-center gap-1">
          <i className="ri-message-3-line text-2xl"></i>
          <h1 className="text-primary text-2xl uppercase font-bold">Let's Chat</h1>
        </div>
        <div className="flex gap-1 text-md items-center">
          <i className="ri-shield-user-line gap-1"></i>
          <h1 className="underline text-sm md:text-base">{user?.name}</h1>
          <i className="ri-logout-circle-line ml-5 text-xl cursor-pointer"
           onClick={()=>{
            localStorage.removeItem("token");
            navigate("/login")
        }}></i>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
};

export default ProtectedRoute;
