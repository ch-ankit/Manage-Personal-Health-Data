import React from 'react'
import Staff from "./images/staff.png"
import Nav from "./Nav.js"
import "./LandingPage.scss"
function LandingPage() {
    return (
        <div className="landingPage">
            <Nav />
            <div className="landingPage__content">
                <h1>Medical History of Patient</h1>
                <p>Where you can access the history of patient</p>
            </div>
            <form className="landingPage__login">
                <h1>Log In</h1>
                <input type="email" id="Email" placeholder="Email" aria-label="Email"/>
                <input type="password" id="Password" placeholder="Password" aria-label="Password"/>
                <button type="submit" id="logIn">Log In</button>
            </form>
            <div className="landingPage__imgBox">
                <img src={Staff} alt=""/>
            </div>
        </div>
    )
}

export default LandingPage
