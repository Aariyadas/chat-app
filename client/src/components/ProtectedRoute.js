import React, { useEffect } from 'react'
import { GetCurrentUser } from '../apiCalls/userapi'
import { useNavigate } from 'react-router-dom'
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux';
import { HideLoader, ShowLoader } from '../redux/loaderSlice';
import { SetUser } from '../redux/userSlice';
const ProtectedRoute = ({children}) => {
  const {user}= useSelector(state =>state.userReducer)
  const dispatch=useDispatch()
  const navigate=useNavigate();
  const getCurrentUser =async() =>{
    try{
      dispatch(ShowLoader())
      const response=await GetCurrentUser()
      dispatch(HideLoader())
      if(response.success){
       dispatch(SetUser(response.data))
      }else{
        toast.error(response.message)
        navigate('/login')
     
      }

    }catch(error){
      dispatch(HideLoader())
      toast.error(error.message)
      navigate('/login')

    }
  }

  useEffect(()=>{
   if(localStorage.getItem("token")){
    getCurrentUser();
   }else{
      navigate('/login');
    }
   
  },[])

  return (
    <div>
      <h1>
    {user?.name}
    </h1>
    {user?.email}
  {children}
  </div>
  )
}

export default ProtectedRoute