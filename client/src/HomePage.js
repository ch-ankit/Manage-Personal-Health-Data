import React from 'react'
import PersonalDetail from './PersonalDetail'
import EmergencyContact from './EmergencyContact'
import "./HomePage.scss"

function HomePage() {
    return (
        <div className="homePage">
            <div className="homePage__content">
                <PersonalDetail />
                <EmergencyContact />
            </div>
        </div>
    )
}

export default HomePage
