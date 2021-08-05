import React from 'react'
import PersonalDetail from './PersonalDetail'
import EmergencyContactView from './EmergencyContactView'
import "./HomePage.scss"

function HomePage() {
    return (
        <div className="homePage">
            <div className="homePage__content">
                <PersonalDetail />
                <EmergencyContactView />
            </div>
        </div>
    )
}

export default HomePage
