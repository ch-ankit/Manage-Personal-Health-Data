import React from 'react'
import './Chose.scss'
import Nav from './Nav'
import {useHistory} from 'react-router-dom'
function Chose() {
    const history=useHistory();
    return (
        <div className='chose'>
            <Nav />
            <div className="chose__content">
                <h1>You Are</h1>
                <div className="chose__select">

                    <div className="chose__Patient" onClick={()=>history.push('/signUpPatient')}>

                    </div>
                    <div className="chose__Doctor" onClick={()=>history.push('/doc')}>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chose
