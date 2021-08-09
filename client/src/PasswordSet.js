import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router';
import './PasswordSet.scss'

function PasswordSet(props) {
    const { doctor } = props
    const userId = useRef(null)
    const password = useRef(null)
    const confirmPassword = useRef(null)
    const [isInValid, setIsInValid] = useState(null)
    const [passwordLengthError, setPasswordLengthError] = useState(null)
    const [passwordLengthInvalid, setPasswordLengthInvalid] = useState(null)
    const history = useHistory()
    const id = history.location.search.slice(4)
    //Functions
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isValidated()) {
            const backendUrl = doctor ? 'http://localhost:7000/password/doctor' : 'http://localhost:7000/password'
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    id: userId.current.value,
                    password: password.current.value
                })
            })
            console.log(response)
            history.push('/')
        }
    }
    function isValidated() {
        console.log(password, confirmPassword)
        if (password.current.value.length < 5) {
            setPasswordLengthError('Password Length must be at least 6 characters')
            setPasswordLengthInvalid(true)
        } else {
            setPasswordLengthInvalid(false)
        }
        if (password.current.value !== confirmPassword.current.value) {
            setIsInValid(true)
        } else {
            setIsInValid(false)
        }
        if (!isInValid && !passwordLengthInvalid) {
            return true
        } else {
            return false
        }
    }
    return (
        <div className="passwordset">
            <h2>Set Your Login Password</h2>
            <form onSubmit={handleSubmit} id="passwordSet">
                <input ref={userId} value={id} type='text' id="userId" placeholder="User-ID" required disabled />
                <input ref={password} type='password' id="password" placeholder="Password" required />
                {passwordLengthInvalid && <span style={{ color: 'red' }}>*{passwordLengthError} </span>}
                <input ref={confirmPassword} type='password' id="confirmPassword" placeholder="Confirm Password" required />
                {isInValid && <span style={{ color: 'red' }}>*Passwords donot match!! </span>}
                <button className="passwordset__button" type="submit" id='submit' form="passwordSet">Confirm</button>
            </form>
        </div>
    );
}

export default PasswordSet;