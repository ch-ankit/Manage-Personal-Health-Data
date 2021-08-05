import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { UserAddIcon, UserRemoveIcon } from "@heroicons/react/solid"
import './FriendList.scss'

function FriendList(props) {
    const [requests, setRequsets] = useState('')
    const docData = useSelector(state => state.user.doctor)
    let darkMode = useSelector((state) => state.user.darkMode)

    useEffect(() => {
        async function getFriendList() {
            const response = await fetch(`http://localhost:7000/doctor/addlist?doctorId=${docData.uId}`)
            const data = await response.json()
            setRequsets(data)
            console.log(data)
        }
        return getFriendList()
    }, [])

    const userAdd = async (e) => {
        const response = await fetch(`http://localhost:7000/share/addPatient`, {
            method: 'POST',
            headers: {
                "Content-type": 'application/json'
            },
            body: JSON.stringify({
                patientId: e,
                doctorId: docData.uId,
                status: "accepted"
            })
        })
        const { message } = await response.json()
        console.log(message)
    }

    var displayRequests;
    if (requests) {
        displayRequests = Object.keys(requests).map(el =>
            <div className="friendlist__requests">
                <div style={{ height: "3em", width: "3em" }}>
                    <img src={requests[el].photo} className={`friendlist__patientPhoto  ${darkMode && "friendlist__imgDark"}`} alt="Friend Request Sender Dp" />
                </div>
                <div>
                    <h1>{requests[el].name}</h1>
                    <h3>Patient Identifier: {requests[el].patientId}</h3>
                    <div>
                        <div onClick={() => userAdd(requests[el].patientId)}><UserAddIcon className="friendlist__userIconAdd" /></div>
                        <div><UserRemoveIcon className="friendlist__userRemoveIcon" value={requests[el].patientId} /></div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className="friendlist" style={{ backgroundColor: 'white', height: '100vh', width: '100%' }}>
            <div className="friendlist__position" style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "80%", margin: '0 auto', paddingTop: '2rem' }}>
                {displayRequests}
            </div>
        </div>
    );
}

export default FriendList;