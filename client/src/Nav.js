import React from 'react'
import "./Nav.scss"
import {useHistory} from 'react-router-dom'
function Nav() {
    const history=useHistory()
    return (
        <header>
            <h1>MHPD</h1>
            <input type="checkbox" id="checking" />
            <label htmlFor="checking">|||</label>
            <nav>
                <ul>
                    <li id="home" onClick={()=>{history.push('/')}}>Home</li>
                    <li id="about" onClick={()=>{history.push('/about')}}>About</li>
                    <li id="sign" onClick={()=>{history.push('/signUp')}}>SignUp</li>
                </ul>
            </nav>
            <div className="mob__nav">
                <ul>
                    <li id="home" onClick={()=>{history.push('/')}}>Home</li>
                    <li id="about" onClick={()=>{history.push('/about')}}>About</li>
                    <li id="sign" onClick={()=>{history.push('/signUp')}}>SignUp</li>
                </ul>
            </div>
        </header>
    )
}

export default Nav
