import React from 'react'
import "./Nav.scss"
import {useHistory} from 'react-router-dom'
function Nav() {
    const history=useHistory()
    return (
        <header className="nav">
            <h1>MHoP</h1>
            <ul>
                <li id="home" onClick={()=>{history.push('/')}}>Home</li>
                <li id="about" onClick={()=>{history.push('/about')}}>About</li>
                <li id="sign" onClick={()=>{history.push('/signUp')}}>SignUp</li>
            </ul>
        </header>
    )
}

export default Nav
