import React from 'react'
import Nav from './Nav'
import "./SignUp.scss"

function SignUp() {
    return (
        <div className="signUp">
            <Nav />
            <form>
                <h1>Sign Up</h1>
                <input type="text" id="name" placeholder="Name" required />
                <input type="text" id="address" placeholder="Address" required />
                <input type="email" id="email" placeholder="Email" required />
                <div className="signUp__select">
                    <h4>Gender</h4>
                    <div className="signUp__customSelect">
                        <select id="gender" required>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
                <input type="text" placeholder="Occupation" required />
                <div className="signUp__emergency">
                    <h4>Emergency contact</h4>
                    <hr />
                    <input type="text" placeholder="Name" required />
                    <input type="text" placeholder="Contact info" pattern="[1-9]{1}[0-9]{9}" required />
                    <input type="text" placeholder="Relation" required />
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    )
}

export default SignUp
