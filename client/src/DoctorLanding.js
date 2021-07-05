import React from 'react'
import './DoctorLanding.scss'
import DoctorImage from './images/doctorPointing.jpg'
function DoctorLanding() {
    return (
        <div className='doctorLanding'>
            <div className="doctorLanding__greeting">
                <h1>Welcome Doctor</h1>
            </div>
            <div className="doctorLanding__list">
                <div className="doctorLanding__imgBox">
                        <img src={DoctorImage} alt="" className='doctorImage'/>
                </div>
                <div className="doctorLanding__patients">
                    <h2>Recent Patients</h2>
                </div>
                
            </div>
        </div>
    )
}

export default DoctorLanding
