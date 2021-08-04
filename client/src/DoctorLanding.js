import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './DoctorLanding.scss'
import { loginUser, recentPatients } from './features/counterSlice';
import DoctorImage from './images/doctorPointing.jpg'
function DoctorLanding() {
    const docData=useSelector(state => state.user.doctor);
    const [recentPatient, setrecentPatient] = useState([]);
    let darkMode = useSelector((state) => state.user.darkMode)
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
    console.log(darkMode)
   return (
        <div className='doctorLanding'>
            <div className="doctorLanding__greeting">
                <h1>Welcome Doctor {docData.firstName +" " + docData.lastName}</h1>
            </div>
            <div className="doctorLanding__list">
                <div className="doctorLanding__content">
                    <div className="doctorLanding__recentPatients">
                        <div className="doctorLanding__imgBox">
                                <img src={DoctorImage} alt="" className={`doctorImage  ${darkMode && "doctorLanding__imgDark"}`}/>
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
                                        <img src={recentPatient[key].photo} alt="Patient Photo" className={`doctorLanding__patientPhoto  ${darkMode && "doctorLanding__imgDark"} `} />
                                        </div>
                                        {recentPatient[key].name}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="doctorLanding__profile">
                        <h2>Profile</h2>
                        <div className="doctorLanding__docImage">
                            <img src={docData.photo} alt="Doctor" className={`doctorLanding__doctorPhoto  ${darkMode && "doctorLanding__imgDark"}`} />
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
