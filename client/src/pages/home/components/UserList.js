import React from 'react'
import { useSelector } from 'react-redux'

const UserList = (searchKey) => {
    const {allUsers}=useSelector(state=>state.userReducer)
  return (
    <div>
        {allUsers.map((userObj)=>{
            return (
            <div className='shadow border p-5'>
               <div className='flex gap-2'>
                
                <h1>{userObj.name}</h1>

               </div>
            </div>
            )
        })}

    </div>
  )
}

export default UserList