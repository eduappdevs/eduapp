import React , {useState} from 'react'
import Navbar from '../components/Navbar'
import Toolbar from '../components/toolbar'
import '../styles/settings.css'
export default function Settings(props) {
    const [location, setLocation] = useState('resources');
    const changeToolbarLocation = (incoming)=>{
        console.log('click', incoming)
        setLocation(incoming)
    }
  return (
      
    <div className='settings-main-container'>
        <Navbar toolbarLocation={changeToolbarLocation}/>
        <div className="settings-content">
        <Toolbar location={location}/>
        </div>
    </div>
  )
}
