import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './DoctorLanding.scss'
import { loginUser, recentPatients } from './features/counterSlice';
import DoctorImage from './images/doctorPointing.jpg'
function DoctorLanding() {
    const docData=useSelector(state => state.user.doctor);
    const [recentPatient, setrecentPatient] = useState([]);
    const dispatch=useDispatch()
    const history=useHistory();
    console.log(docData)
    useEffect(() => {
        async function getRecentPatients(){
            const response=await fetch(`http://localhost:7000/doctor/recentpatient?doctorId=${docData.uId}`,{
                method:"GET"
            });
            const data=await response.json();
            console.log(data)
            setrecentPatient(data);
        }
        return getRecentPatients()
    }, [])
   return (
        <div className='doctorLanding'>
            <div className="doctorLanding__greeting">
                <h1>Welcome Doctor {docData.firstName +" " + docData.lastName}</h1>
            </div>
            <div className="doctorLanding__list">
                <div className="doctorLanding__content">
                    <div className="doctorLanding__recentPatients">
                        <div className="doctorLanding__imgBox">
                                <img src={DoctorImage} alt="" className='doctorImage'/>
                        </div>
                        <div className="doctorLanding__patients">
                            <h2>Recent Patients</h2>
                            {Object.keys(recentPatient).map((key)=>{
                                return(
                                    <div key={key} className="doctorLanding__recentPatient"
                                    onClick={()=>{
                                        history.push("/Doctor/patientDocuments")
                                        dispatch(recentPatients(recentPatient[key]));
                                    }}
                                    >
                                        <div className="doctorLanding__patientImage">
                                        <img src={recentPatient[key].photo} alt="Patient Photo" />
                                        </div>
                                        {recentPatient[key].name}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="doctorLanding__profile">
                        <div className="doctorLanding__docImage">
                            <img src={docData.photo} alt="Doctor" />
                        </div>

                        <h3>Dr. {docData.firstName} {docData.lastName}</h3>
                        <h4>{docData.email}</h4>
                        <h5>{docData.phone}</h5>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DoctorLanding
