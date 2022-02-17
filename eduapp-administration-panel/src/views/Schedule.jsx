import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Scheduleeventslist from '../components/scheduleeventslist'
import Schedulesessionslist from '../components/schedulesessionslist'
import Toolbar from '../components/toolbar'
import '../styles/schedule.css'


export default function Schedule(props) {
    const [location, setLocation] = useState('sessions');
    const changeToolbarLocation = (incoming)=>{
        console.log('click', incoming)
        setLocation(incoming)
    }
    
  return (
    <div className='schedule-main-container'>
        <Navbar toolbarLocation={changeToolbarLocation}/>
        <div className="schedule-sessions-container">
            <Toolbar location={location}/>
            {
                location == 'sessions' ? 
            <Schedulesessionslist/>
            :
            <Scheduleeventslist/>
            }
        </div>
    </div>
  )
}
