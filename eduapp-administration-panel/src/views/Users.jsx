import React, {useState} from 'react'
import Toolbar from '../components/toolbar';
import Navbar from '../components/Navbar'
import '../styles/users.css'
export default function Users() {
  const [location, setLocation] = useState('sessions');
  const changeToolbarLocation = (incoming)=>{
        console.log('click', incoming)
        setLocation(incoming)
    }
  return (
    <div className='users-main-container'>
        <Navbar toolbarLocation={changeToolbarLocation}/>
        <div className="schedule-sessions-container">
            <Toolbar location={location}/>
            <div className="users-list">
              
            </div>
        </div>
    </div>
  )
}
