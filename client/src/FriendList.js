import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { UserAddIcon, UserRemoveIcon } from "@heroicons/react/solid"
import noRequestImg from './images/no requests.jpg'
import './FriendList.scss'

function FriendList(props) {
    const [requests, setRequsets] = useState('')
    const docData = useSelector(state => state.user.doctor)
    let darkMode = useSelector((state) => state.user.darkMode)

    useEffect(() => {
        async function getFriendList() {
            const response = await fetch(`http://localhost:7000/doctor/addlist?doctorId=${docData?.uId}`)
            const data = await response.json()
            setRequsets(data)
            console.log(data)
        }
        return getFriendList()
    }, [])

    const userDecision = async (e, decision) => {
        const response = await fetch(`http://localhost:7000/share/addPatient`, {
            method: 'POST',
            headers: {
                "Content-type": 'application/json'
            },
            body: JSON.stringify({
                patientId: e,
                doctorId: docData.uId,
                status: decision,
                firstName: docData.firstName,
                lastName: docData.lastName,
                photo: docData.photo
            })
        })
        const { message } = await response.json()
        console.log(message)
        window.location.reload()
    }

    var displayRequests;
    if (requests) {
        displayRequests = Object.keys(requests).map(el =>
            <div className="friendlist__requests">
                <div style={{ height: "7em", width: "7em" }}>
                    <img src={requests[el].photo} className={`friendlist__patientPhoto  ${darkMode && "friendlist__imgDark"}`} alt="Friend Request Sender Dp" />
                </div>
                <div>
                    <h2>{requests[el].name}</h2>
                    <h4>Patient Identifier: {requests[el].patientId}</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2em' }}>
                        <button style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'lightgreen', borderRadius: '1rem', padding: '0.5rem', cursor: 'pointer' }} onClick={() => userDecision(requests[el].patientId, 'accepted')}>
                            <span style={{ color: 'black' }}>Connect</span><UserAddIcon className="friendlist__userIconAdd" />
                        </button>
                        <button style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'red', borderRadius: '1rem', padding: '0.5rem', cursor: 'pointer' }} onClick={() => userDecision(requests[el].patientId, 'rejected')}>
                            <span style={{ color: 'black' }}>Reject</span><UserRemoveIcon className="friendlist__userRemoveIcon" />
                        </button>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className="friendlist" style={{ backgroundColor: 'white', height: '100vh', width: '100%' }}>
            <div className="friendlist__position" style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "80%", margin: '0 auto', paddingTop: '2rem' }}>
                {requests.length === 0 &&
                    (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto', marginTop: '3em' }}>
                        <img style={{ width: "50%" }} src={noRequestImg} alt="No request " />
                        <h2 style={{ color: 'lightcoral' }}>No New Connect Requests</h2>
                    </div>)}
                {displayRequests}
            </div>
        </div>
    );
}

export default FriendList;