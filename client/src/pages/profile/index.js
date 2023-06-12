import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UpdatedProfilePicture } from "../../apiCalls/userapi";

import { toast } from 'react-hot-toast';
import {SetUser} from "../../redux/userSlice"
import { HideLoader, ShowLoader } from '../../redux/loaderSlice';

function Profile() {
  const { user } = useSelector((state) => state.userReducer);
  const [image, setImage] = React.useState("");
const dispatch =useDispatch();
  const onFileSelect = async (e) => {
    const file = e.target.files[0];
    console.log(file);
    const reader = new FileReader(file);
    reader.readAsDataURL(file);
    reader.onload = async () => {
      setImage(reader.result);
    };
  };

  const updateProfilePic =async()=>{
    try{
      dispatch(ShowLoader());
      const response =await UpdatedProfilePicture(image);
      dispatch(HideLoader());
      if(response.success){
        toast.success("Profile Pic Updated")
        dispatch(SetUser(response.data))
      }else{
        toast.error(response.error)
      }

    }catch(error){
      dispatch(HideLoader());
      toast.error(error.message)

    }
  }

  useEffect(() => {
    if (user?.profilePic) {
      setImage(user.profilePic);
    }
  }, [user]);

  return (
    user && (
      <div className="flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm">
          <h1 className="text-3xl text-gray-700 mb-4">{user.name}</h1>
          <div className="flex justify-center">
            <img
              src={image}
              alt="profile pic"
              className="w-32 h-32 rounded-full my-4"
            />
          </div>
          <div className="mb-4">
            <h3 className="text-lg text-gray-700">Email: {user.email}</h3>
            <h3 className="text-lg text-gray-700">
              Created At: {moment(user.createdAt).format("MM-DD-YYYY")}
            </h3>
          </div>
          <div>
            <label htmlFor="file-input" className="cursor-pointer">
              Add Profile Pic
            </label>
            <input
              type="file"
              onChange={onFileSelect}
              className="file-input border-0"
            />

            <button className="contained-btn "
            onClick={updateProfilePic}
            >Update</button>
          
          </div>
        </div>
      </div>
    )
  );
}

export default Profile;
