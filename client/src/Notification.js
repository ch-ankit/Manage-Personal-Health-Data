import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import "./HomeNav.scss"
import { darkmode, logoutUser, logoutDoctor } from './features/counterSlice';
function Notification() {
    const [update, setUpdate] = useState('')
    const socket = io("http://localhost:7000", {
        path: '/notification/',
    })
    useEffect(() => {
        console.log('hello')
    }, [update])
    socket.on('connection', () => {
        console.log('connected')
    })
    const params = {
        senderId: 12345
    }
    socket.emit('joinNotifications', params, () => { })
    socket.on('recieveNotifications', (request) => {
        setUpdate(request)
    })
    const history = useHistory();
    const dispatch = useDispatch()
    const docData = useSelector(state => state.user.doctor)
    const userData = useSelector(state => state.user.value) ?? docData;
    let darkMode = useSelector((state) => state.user.darkMode)
    const [, setDark] = useState(false)
    useEffect(() => {
        const changeBackGround = () => {
            if (document.querySelector('.circle') != null) {
                darkMode && document.querySelector('.circle').classList.toggle('active');
                darkMode && document.querySelector('.darkMode').classList.toggle('active');
                darkMode ? setDark(true) : setDark(false);
            }
        }
        return changeBackGround;
    }
    );
    const manageClick = () => {
        socket.emit('sendNotifications', {
            message: `You clicked on the AAAA`
        }, () => { })
    }
    return (
        <div className="homeNav">
            <h1>MHPD</h1>  {/* title of the project */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                Light
                <div className="toggleButton" onClick={() => {
                    dispatch(darkmode());
                    darkMode = !darkMode;
                    darkMode && document.querySelector('.circle').classList.toggle('active');
                    !darkMode && document.querySelector('.circle').classList.remove('active');
                    darkMode && document.querySelector('.darkMode').classList.toggle('active')
                    !darkMode && document.querySelector('.darkMode').classList.remove('active')
                    console.log(darkMode)
                }}>
                    <div className="circle"></div>
                </div>
                Dark
            </div>
            <div onClick={manageClick}>AAAA</div>
            <div className="homeNav__right" onClick={() => {
                document.querySelector('.homeNav__onClick').classList.toggle('active')
            }}>
                <img className={`homeNav__icon ${darkMode && "iconDark"}  `} src={userData?.photo} alt={userData?.firstName.slice(0, 1)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                <p>{userData?.firstName}</p>   {/* display the userName */}
                <div className="downArrow">
                </div>
                <div className="homeNav__onClick">
                    <ul>
                        <li>Settings</li>
                        <li onClick={() => {
                            dispatch(logoutUser())
                            dispatch(logoutDoctor())
                            darkMode && dispatch(darkmode())
                            history.push('/')
                        }}>Log Out</li>
                    </ul>
                </div>
            </div>
            <div className="darkMode">

            </div>
        </div>
    )
}

export default Notification
