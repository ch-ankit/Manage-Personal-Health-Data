import React from 'react'
import HomeDrawer from './HomeDrawer'
import HomeNav from './HomeNav'
import PersonalDetail from './PersonalDetail'
import "./HomePage.scss"

function HomePage() {
    return (
        <div className="homePage">
            <HomeNav />
            <div className="homePage__content">
                <HomeDrawer />
                <PersonalDetail />
            </div>
        </div>
    )
}

export default HomePage
