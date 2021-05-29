import React from 'react'
import PersonalDetail from './PersonalDetail'
import "./HomePage.scss"

function HomePage() {
    return (
        <div className="homePage">
            <div className="homePage__content">
                <PersonalDetail />
            </div>
        </div>
    )
}

export default HomePage
