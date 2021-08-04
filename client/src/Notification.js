import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import './Notification.scss'

function Notification(props) {
    const [notification, setNotification] = useState('')
    const docData = useSelector(state => state.user.doctor)
    const userData = useSelector(state => state.user.value);
    useEffect(() => {
        async function getNotifications() {
            const url = props.doctor ? `http://localhost:7000/doctor/getnotification?doctorId=${docData?.uId}` :
                `http://localhost:7000/patient/getnotification?patientId=${userData?.uId}`//Patient url for fetch nots
            const response = await fetch(url, {
                method: 'GET'
            })
            const data = await response.json()
            setNotification(data)
        }
        return getNotifications()
    }, [])
    var displayNotifications
    if (notification) {
        displayNotifications = Object.keys(notification).map(el => <Link><div className="notification__display">{notification[el].patientName} has shared a file with you</div></Link>)
    }
    return (
        <div className='notification' style={{ backgroundColor: 'white', height: '94.5vh', width: '100%' }}>
            {displayNotifications}
        </div>
    );
}

export default Notification;