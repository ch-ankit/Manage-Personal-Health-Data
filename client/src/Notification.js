import React, { useEffect, useState, useRef } from 'react'
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import "./HomeNav.scss"
import { darkmode, logoutUser, logoutDoctor } from './features/counterSlice';

function Notification() {
    const [connectedUsers, setConnectedUsers] = useState('')
    const [intendedDoctor, setIntendedDoctor] = useState('')
    const [sentPatientName, setSentPatientName] = useState('')
    const [notifier, setNotifier] = useState('')
    const socket = useRef()
    const history = useHistory();
    const dispatch = useDispatch()
    const docData = useSelector(state => state.user.doctor)
    const userData = useSelector(state => state.user.value) ?? docData;
    let darkMode = useSelector((state) => state.user.darkMode)
    const [, setDark] = useState(false)

    useEffect(() => {
        socket.current = io("http://localhost:7000", {
            path: '/notification/',
        })
    })
    useEffect(() => {
        if (docData) {
            socket.current.emit('addUser', docData.uId)
            socket.current.on('getUsers', (users) => setConnectedUsers(users))
        } else {
            socket.current.emit('addUser', userData.uId)
            socket.current.on('getUsers', (users) => setConnectedUsers(users))
        }
    }, [docData, userData])

    useEffect(() => {
        socket.current.on('pushNotificationDoctor', (parameters) => {
            setNotifier(parameters)
            setIntendedDoctor(parameters.doctorId)
        })

    })
    console.log(notifier)

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

    const handlelClick = () => {
        const params = {
            patientName: 'Babin',
            patientId: '777333'
        }
        socket.current.on('connect', () => {

        })
        socket.current.emit('shareDocs', params, () => {
            console.log('Shared from client')
        })
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
            <button onClick={handlelClick}>Share</button>
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
