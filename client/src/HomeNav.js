import React from 'react'
import './HomeNav.scss'
import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
import { logout } from './features/counterSlice';
import { useDispatch } from 'react-redux';


function HomeNav() {
    const dispatch=useDispatch();
    return (
        <div className="homeNav">
                
                <label className="check-label" htmlFor="check">|||</label>
            <h3>MHoP</h3>
            <div className="homeNav__icons">
                <div className="homeNav__visibleIcon">
                <HomeIcon id="Home" />
                <CalendarTodayIcon />
                <PersonIcon />
                <SettingsIcon />
                </div>
                <input type="checkbox" id="check" />

            <div className="homeNav__labels">
                <label htmlFor="Home">Home</label>
                <label htmlFor="">Calender</label>
                <label htmlFor="">Account</label>
                <label htmlFor="">Settings</label>
            </div>
            </div>

            <div className="homeNav__exit" onClick={()=>dispatch(logout())}>
                <ExitToAppIcon />
            </div>
        </div>
    )
}

export default HomeNav
