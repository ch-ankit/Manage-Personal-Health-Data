import React, { useEffect, useState, useRef } from 'react'
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { BellIcon } from "@heroicons/react/outline"
import { UsersIcon } from "@heroicons/react/outline"
import "./HomeNav.scss"
import { darkmode, logoutUser, logoutDoctor } from './features/counterSlice';
function HomeNav(props) {
    const [countNotifications, setCountNotifications] = useState(0)
    const [countFriendReqs, setCountFriendReqs] = useState(0)
    const [connectedUsers, setConnectedUsers] = useState('')
    const [intendedDoctor, setIntendedDoctor] = useState('')
    const [sentPatientName, setSentPatientName] = useState('')
    const [notifier, setNotifier] = useState([])
    const [friendNotifier, setFriendNotifier] = useState([])
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
            console.log('From use Effect user')
            socket.current.emit('addUser', userData.uId)
            socket.current.on('getUsers', (users) => setConnectedUsers(users))
        }
    }, [docData, userData])

    useEffect(() => {
        socket.current.on('pushNotificationDoctor', (parameters) => {
            console.log('Run from push nots')
            setCountNotifications((prevState) => prevState + 1)
            setNotifier((prevState) => [...prevState, parameters])
            setIntendedDoctor(parameters.doctorId)
            setSentPatientName(parameters.patientName)
            // socket.current.emit('checkUser', parameters)
        })
        socket.current.on('pushNotificationDoctorAdd', (parameters) => {
            setCountFriendReqs((prevState) => prevState + 1)
            setFriendNotifier((prevState) => [...prevState, parameters])
        })
        // socket.current.on('verifiedUser', (parameters) => {
        //     setNotifier(parameters)
        //     setIntendedDoctor(parameters.doctorId)
        //     setSentPatientName(parameters.patientName)
        // })
        // socket.current.on('doctorOffline', (parameters) => {
        //     socket.emit('handleOffline', parameters)
        // })
    }, [])
    console.log(friendNotifier, intendedDoctor, sentPatientName, countNotifications)

    useEffect(() => {
        const changeBackGround = () => {
            if (document.querySelector('.circle') != null) {
                darkMode && document.querySelector('.circle').classList.toggle('active');
                darkMode && document.querySelector('.darkMode').classList.toggle('active');
                darkMode ? setDark(true) : setDark(false);
            }
        }
        return changeBackGround;
    }, []);
    var displayNotifications
    var displayFriendNotifications
    if (notifier) {
        displayNotifications = Object.keys(notifier).map(el => <li>{notifier[el].patientName} shared a document with you</li>)
    }
    if (friendNotifier) {
        displayFriendNotifications = Object.keys(friendNotifier).map(el => <li>{friendNotifier[el].patientName} shared a document with you</li>)
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
            {
                props.doctor &&
                (<div>
                    <div><UsersIcon className={countFriendReqs === 0 ? "homeNav__userIconNoNots" : "homeNav__userIconNots"} />{countFriendReqs === 0 ? '' : countFriendReqs}</div>
                </div>)
            }
            <div className="homeNav__notify">
                <BellIcon className={countNotifications === 0 ? "homeNav__bellIconNoNots" : "homeNav__bellIconNots"} onClick={() => {
                    fetch('http://localhost:7000/share', {
                        method: 'POST',
                        headers: {
                            "Content-type": 'application/json'
                        },
                        body: JSON.stringify({
                            id: "20000707-513569",
                            doctorId: "777333",
                            masterId: "1627121446880",
                            accessTime: "2880"
                        })
                    })
                }} /> {countNotifications === 0 ? '' : countNotifications}
                <div className="homeNav__notifications">
                    <ul>
                        {notifier ? displayNotifications : ''}
                    </ul>
                </div>
            </div>
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
                            window.location.reload()
                        }}>Log Out</li>
                    </ul>
                </div>
            </div>
            <div className="darkMode">

            </div>
        </div>
    )
}

export default HomeNav
