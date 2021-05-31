import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router';
import './PasswordSet.scss'

function PasswordSet(props) {
    const userId = useRef(null)
    const password = useRef(null)
    const confirmPassword = useRef(null)
    const [isValid, setIsValid] = useState(true)
    const history = useHistory()

    //Functions
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isValidated()) {
            const response = await fetch('http://localhost:7000/password', {
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
        if (password.current.value !== confirmPassword.current.value) {
            setIsValid(false)
            return false
        }
        else {
            return true
        }
    }
    return (
        <div className="passwordset">
            <h2>Set Your Login Password</h2>
            <form onSubmit={handleSubmit} id="passwordSet">
                <input ref={userId} type='text' id="userId" placeholder="User-ID" required />
                <input ref={password} type='password' id="password" placeholder="Password" required />
                <input ref={confirmPassword} type='password' id="confirmPassword" placeholder="Confirm Password" required />
                {!isValid && <span style={{ color: 'red' }}>*Passwords donot match!! </span>}
                <button type="submit" id='submit' form="passwordSet">Confirm</button>
            </form>
        </div>
    );
}

export default PasswordSet;