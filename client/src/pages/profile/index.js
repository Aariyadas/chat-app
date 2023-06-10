import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";

function Profile() {
  const { user } = useSelector((state) => state.userReducer);
  const [img ="",setImage] =React.useState(user?.profilePic)


  const onFileSelect =async(e)=>{
    const file=e.target.files[0];
    console.log(file)
    const reader =new FileReader(file)
    reader.readAsDataURL(file);
    reader.onload =async ()=>{
      setImage(reader.result)  

    }
  }
  return (
    <div>
      <h1
        className="text-2xl font-semibold upper
        text-gray-700"
      >
        {user.name}
      </h1>
      <h1>{user.email}</h1>
      <h1>Created At :{moment(user.createdAt).format("MM-DD-YYYY")}</h1>
      {user.profilePic && (
        <img
          src={img}
          alt="profile pic"
          className="w-32 h-32 rounded-full
        "
        />
      )}
      <div>
        <label htmlFor="file-input" className="curso-pointer">
            Add Profile Pic
        </label>
      <input type="file"
      onChange={onFileSelect}
      className="file-input border-0"
      />
      </div>
    </div>
  );
}

export default Profile;
