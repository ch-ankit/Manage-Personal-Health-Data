import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom';
import { documentGet } from './features/counterSlice';
import "./RecentPatientDocuments.scss"
import { RefreshIcon } from "@heroicons/react/solid"
function ReccentPatientDocuments() {
    const patientData = useSelector(state => state.user.recentPatient)
    const docData = useSelector(state => state.user.doctor);
    const [documents, setdocuments] = useState([]);
    const dispatch = useDispatch()
    let darkMode = useSelector((state) => state.user.darkMode)
    const history = useHistory();
    useEffect(() => {
        async function getDocuments() {
            const response = await fetch(`http://localhost:7000/doctor/recentdocuments?doctorId=${docData.uId}&patientId=${patientData.value}`, {
                method: "GET"
            });
            const data = await response.json();
            console.log(data)
            setdocuments(data);
        }
        return getDocuments()
    }, [])
    const reRequest = async (patientId, documentId, doctorId, title) => {
        console.log(patientId, documentId, doctorId, title)
        const response = await fetch(`http://localhost:7000/doctor/requestdocument`, {
            method: "POST",
            headers: {
                "Content-type": 'application/json'
            },
            body: JSON.stringify({
                patientId: patientId,
                masterId: documentId,
                doctorId: doctorId,
                name: `Dr. ${docData.firstName} ${docData.lastName}`,
                photo: docData.photo,
                title: title
            })
        });
        const { message } = await response.json()
        console.log(message)
    }
    return (
        <div className="recentPatientDocuments">
            <div className="recentPatientDocuments__patientDetail">
                <div className="recentPatientDocuments__imgBox">
                    <img src={patientData.photo} alt='Patient display' className={`recentPatientDocuments__patientPhoto ${darkMode && "dark__patientPhoto"} `} />
                </div>
                <h3>{patientData.name}</h3>
            </div>
            <div className="recentPatientDocuments__documents">
                <h4>Documents</h4>
                {Object.keys(documents).map((key) => {
                    return (
                        <div style={{ width: "100%", display: "flex", alignItems: "center", position: "relative" }}>
                            <div key={key}
                                className={`recentPatientDocuments__list ${documents[key].terminationStatus === 1 && "recentPatientDocuments__terminatedList"} ${Math.floor(documents[key].timeStamp - Date.now() / 60000) < 0 && "recentPatientDocuments__timeUpList"} `}
                                onClick={() => {
                                    dispatch(documentGet(documents[key].documentId.concat(".pdf")));
                                    history.push("/Doctor/documentViewer")
                                    console.log(documents[key].documentId.concat(".pdf"))
                                }}
                            >
                                <p>{documents[key].title}</p>
                                <p>{documents[key].documentId}</p>
                                <p>Remaining Time: {Math.floor(documents[key].timeStamp - Date.now() / 60000) > 0 ? Math.floor((documents[key].timeStamp - Date.now() / 60000)) + " min" : " 00 min"}</p>
                            </div>
                            <RefreshIcon onClick={() => reRequest(documents[key].patientId, documents[key].documentId, documents[key].doctorId, documents[key].title)} className={`recentPatientDocuments__icon ${(documents[key].terminationStatus === 1 || Math.floor(documents[key].timeStamp - Date.now() / 60000) < 0) && "recentPatientDocuments__iconactive"}`} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ReccentPatientDocuments
