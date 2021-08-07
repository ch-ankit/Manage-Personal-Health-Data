import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { documentGet, patientDataDoctorNotification } from './features/counterSlice';
import './Notification.scss'

function Notification(props) {
    const [notification, setNotification] = useState('')
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
        const url = props.doctor ? `http://localhost:7000/doctor/getnotification?doctorId=${docData?.uId}` :
            ``
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
    var displayNotifications
    if (notification && props.doctor) {
        displayNotifications = Object.keys(notification).map(el => {
            return <Link style={{ width: "100%" }} onClick={() => {
                dispatch(patientDataDoctorNotification(notification[el].patientId))
                dispatch(documentGet(notification[el].documentId.concat(".pdf")))
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
    return (
        <div className='notification' style={{ backgroundColor: 'white', height: '100%', width: '100%' }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "80%", margin: '0 auto', position: 'relative', paddingTop: '2rem' }}>
                <p style={{ position: 'absolute', right: '0', top: "1rem", border: 'black 1px solid', padding: '2px' }} onClick={markRead}>Mark all as Read</p>
                {displayNotifications}
            </div>
        </div>
    );
}

export default Notification;