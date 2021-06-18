import React, { useRef, useState } from 'react'
import storage from './firebaseConfig'
import Nav from './Nav'
import "./SignUpDoc.scss"

function SignUp() {
    //Practitioner Parameters
    const docFirstName = useRef(null) //Firstname
    const docLastName = useRef(null) //Lastname
    const docMiddleName = useRef(null) //add this to Firstname with a space
    const docMobileNo = useRef(null)
    const docEmail = useRef(null)
    const docHouseNumber = useRef(null)
    const docState = useRef(null)
    const docDistrict = useRef(null)
    const docCity = useRef(null)
    const docPostalCode = useRef(null)
    const docGender = useRef(null)
    const nmcRegdNo = useRef(null)
    //Firebase resource
    const [docPhoto, setDocPhoto] = useState('')
    const [viewFile, setViewFile] = useState('')


    //Functions
    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files[0]) {
            if (e.target.files[0].type.match(/image-*/)) {
                setDocPhoto(e.target.files[0]);
                setViewFile(URL.createObjectURL(e.target.files[0]))
            }
            else {
                alert('Not an image file')
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const uploadTask = storage.ref(`images/${docPhoto.name}`).put(docPhoto);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                    .ref("images")
                    .child(docPhoto.name)
                    .getDownloadURL()
                    .then(async (url) => {
                        const response = await fetch('http://localhost:7000/signup/doctor', {
                            method: 'POST',
                            headers: {
                                'Content-type': 'application/json'
                            },
                            body: JSON.stringify({

                            })
                        })

                        console.log(response)
                    })

            }
        )

    }
    return (
        <div className="signUpDoc">
            <Nav />
            <form id="SignUpForm" onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
                <div className="signUpForm__name">
                    <input ref={docFirstName} type="text" id="name" placeholder="First Name" required />
                    <input ref={docMiddleName} type="text" id="name" placeholder="Middle Name" />
                    <input ref={docLastName} type="text" id="name" placeholder="Last Name" required />
                </div>
                <div className="signUpForm__address">
                    <input ref={docCity} type="text" id="docCity" placeholder="City" required />
                    <input ref={docDistrict} type="text" id="docDistrict" placeholder="District" required />
                    <input ref={docState} type="text" id="docState" placeholder="State" required />
                    <input ref={docHouseNumber} type="text" id="docHouseNumber" placeholder="House/Appartment Number" />
                </div>

                <input ref={docPostalCode} type="text" id="docPostalCode" placeholder="Postal Code" required />

                <input ref={docEmail} type="email" id="email" placeholder="Email" required />

                <input ref={docMobileNo} type="text" id="docMobileNo" placeholder="Contact Number" required />

                <input ref={nmcRegdNo} type="text" id="nmcRegdNo" placeholder="NMC Registration Number" required />
                <input type="file" accept="image/*" id="image" alt="Profile photo" onChange={handleChange} required />
                <img src={viewFile} style={{ height: '81px', width: '256px' }} alt="Uploaded" />
                <div className="signUp__select">
                    <h4>Gender</h4>
                    <div className="signUp__customSelect">
                        <select ref={docGender} defaultChecked="Select Gender" id="gender" required>
                            <option value="Select Gender" hidden > Please Select Your Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
                <button type="submit" id='submit' form="SignUpForm">Sign Up</button>
            </form>
        </div>
    )
}

export default SignUp
