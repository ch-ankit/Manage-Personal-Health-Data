import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { recentPatients } from './features/counterSlice';
import "./Patients.scss"

function Patients() {
    const docData = useSelector(state => state.user.doctor);
    const [recentPatient, setrecentPatient] = useState([]);
    let darkMode = useSelector((state) => state.user.darkMode)
    const dispatch = useDispatch()
    const history = useHistory();
    console.log(docData)
    useEffect(() => {
        async function getRecentPatients() {
            const response = await fetch(`http://localhost:7000/doctor/recentpatient?doctorId=${docData.uId}`, {
                method: "GET"
            });
            const data = await response.json();
            console.log(data)
            setrecentPatient(data);
        }
        return getRecentPatients()
    }, [])
    return (
        <div className="patients">
            <h2>Patients</h2>
             {Object.keys(recentPatient).map((key) => {
                return (
                    <div key={key} className="patients__recentPatient"
                        onClick={() => {
                            console.log(recentPatient[key])
                            history.push("/Doctor/patientDocuments")
                            dispatch(recentPatients(recentPatient[key]));
                                }}
                                >
                    <div className="patients__patientImage">
                        <img src={recentPatient[key].photo} alt="Patient Photo" className={`patients__patientPhoto  ${darkMode && "patients__imgDark"} `} />
                    </div>
                    {recentPatient[key].name}
                    </div>
                                )
                            })}
        </div>
    )
}

export default Patients
