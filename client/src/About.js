import React from 'react'
import Nav from './Nav'
import doctor from './images/doctor.png'
import "./About.scss"
function About() {
    return (
        <div className="about">
            <Nav />
            <div className="about__details">
            <div className="about__us">
                <h1>About Us</h1>
            </div>
            <div className="about__comments">
                <div className="about__imgBox">
                    <img src={doctor} alt=" " />
                </div>
                <div className="about__comment">
                    <h3>Nischala Bhandari</h3>
                    <p>This web app made my life so much easier and saved so much time</p>
                </div>
            </div>
            </div>
            
        </div>
    )
}

export default About
