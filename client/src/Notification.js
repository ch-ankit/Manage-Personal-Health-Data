import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { CheckIcon, XIcon } from "@heroicons/react/solid"
import bell from './images/bell.jpg'

import { documentGet, patientDataDoctorNotification, recentPatients } from './features/counterSlice';
import './Notification.scss'

function Notification(props) {
    const [notification, setNotification] = useState('')
    const timeNumber = useRef(null);
    const timeUnit = useRef(null)
    let darkMode = useSelector((state) => state.user.darkMode)
    const dispatch = useDispatch()
    const docData = useSelector(state => state.user.doctor)
    const userData = useSelector(state => state.user.value);
    useEffect(() => {
        async function getNotifications() {
            const url = props.doctor ? `http://localhost:7000/doctor/getnotification?doctorId=${docData?.uId}` :
                `http://localhost:7000/personal/requesteddocument?patientId=${userData?.uId}`//Patient url for fetch nots
            const response = await fetch(url, {
                method: 'GET'
            })
            const data = await response.json()
            setNotification(data)
            console.log(data)
        }
        return getNotifications()
    }, [])

    const markRead = async (e) => {
        const url = props.doctor && `http://localhost:7000/doctor/getnotification?doctorId=${docData?.uId}`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-type": 'application/json'
            },
            body: JSON.stringify({
                doctorId: docData?.uId
            })
        })
        const { message } = await response.json()
        alert(message)
        window.location.reload()
    }
    const userDecision = async (e, decision, masterId) => {
        let accessTime;
        switch (timeUnit.current.value) {
            case "hr":
                accessTime = (timeNumber.current.value) * 60;
                break;
            case "day":
                accessTime = (timeNumber.current.value) * 1440;
                break;
            case "min":
                accessTime = timeNumber.current.value;
                break;
            default:
                console.log('Default case reached')
        }
        if (timeNumber !== null && timeUnit !== null) {
            console.log(e, masterId)
            const response = await fetch(`http://localhost:7000/personal/requesteddocument`, {
                method: 'POST',
                headers: {
                    "Content-type": 'application/json'
                },
                body: JSON.stringify({
                    patientId: userData?.uId,
                    doctorId: e,
                    status: decision,
                    name: `${userData?.firstName} ${userData?.lastName}`,
                    photo: userData?.photo,
                    masterId: masterId,
                    accessTime: accessTime
                })
            })
            const { message } = await response.json()
            console.log(message)
        } else {
            alert('Please select the Access time')
        }
    }
    var displayNotifications

    if (notification && props.doctor) {
        displayNotifications = Object.keys(notification).map(el => {
            return <Link style={{ width: "100%" }} onClick={() => {
                dispatch(patientDataDoctorNotification(notification[el].patientId))
                dispatch(documentGet({
                    filename:(notification[el].documentId.concat(".pdf"))
                }))
                dispatch(recentPatients(notification[el].patientId));
            }} key={el} to="/Doctor/documentViewer" >
                <div className={`${notification[el].markAsRead === "false" ? "notification__display" : "notification__displayRed"}`}>
                    <div style={{ width: "3em", height: "3em" }}>
                        <img src={notification[el].photo} alt="Patient DP" className={`notification__patientPhoto  ${darkMode && "notification__imgDark"}`} />
                    </div>
                    {notification[el].patientName} has shared a {notification[el].title} record with you
                </div>
            </Link >
        })
    }
    if (notification && !props.doctor) {
        displayNotifications = Object.keys(notification).map(el => {
            console.log(notification[el].doctorId, notification[el].masterId)
            return (
                <div className="friendlist__requests">
                    <div style={{ height: "7em", width: "7em" }}>
                        <img src={notification[el].photo} className={`friendlist__patientPhoto  ${darkMode && "friendlist__imgDark"}`} alt="Doctor Dp" />
                    </div>
                    <h2>{notification[el].name}</h2>
                    <h4>Doctor Identifier: {notification[el].doctorId}</h4>
                    <h4>Document Title: {notification[el].title}</h4>
                    <div className="shareDocuments__selectTime">
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2em' }}>
                            <button style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'lightgreen', borderRadius: '1rem', padding: '0.5rem', cursor: 'pointer' }} onClick={() => userDecision(notification[el].doctorId, 'granted', notification[el].masterId)}>
                                <span style={{ color: 'black' }}>Accept</span><CheckIcon className="friendlist__userIconAdd" />
                            </button>
                            <button style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'red', borderRadius: '1rem', padding: '0.5rem', cursor: 'pointer' }} onClick={() => userDecision(notification[el].doctorId, 'rejected', notification[el].masterId)}>
                                <span style={{ color: 'black' }}>Reject</span><XIcon className="friendlist__userRemoveIcon" />
                            </button>
                        </div>
                    </div>
                </div>)
        })
    }
    return (
        <div className='notification' style={{ backgroundColor: 'white', height: '100%', width: '100%' }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "80%", margin: '0 auto', position: 'relative', paddingTop: '2rem' }}>
                <p style={{ position: 'absolute', right: '0', top: "1rem", border: 'black 1px solid', padding: '2px' }} onClick={markRead}>Mark all as Read</p>
                {notification.length === 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto', marginTop: '3em' }}>
                        <img style={{ width: "50%" }} src={bell} alt="No request " />
                        <h2 style={{ color: 'lightcoral' }}>All caught Up!!</h2>
                    </div>)}
                {displayNotifications}
                <div className="notification__shareTime">
                    <input ref={timeNumber} type="number" />
                    <select ref={timeUnit}>
                        <option value="day">day</option>
                        <option value="hr">hr</option>
                        <option value="min">min</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default Notification;