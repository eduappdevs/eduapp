import React, { useEffect, useState } from 'react'

export default function PreviewUsersTable(props) {

    const [users,setUsers] = useState(null)


    setInterval(()=>{
        setUsers(props.users) 
    },2000)


    useEffect(()=>{
        setUsers(props.users)
    },[props])


  return users != null &&(
    users.map((user) => {
        console.log(user)
        return (
            <ul>
                <li>
                {user[0]}
                {user[1]}
            </li>

            </ul>
            
        )

})
  )
}
