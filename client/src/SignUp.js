import React, { useRef, useState } from 'react'
import storage from './firebaseConfig'
import Nav from './Nav'
import "./SignUp.scss"

function SignUp() {
    //Patient parameters
    const address = useRef(null)
    const contactInfo = useRef(null)
    const dob = useRef(null);
    const email = useRef(null)
    const emergencyContactName = useRef(null)
    const emergencyContactNo = useRef(null)
    const emergencyContactRltn = useRef(null)
    const gender = useRef(null)
    const occupation = useRef(null)
    const language = useRef(null)
    const maritalStatus = useRef(null)
    const name = useRef(null)
    const zipCode = useRef(null)
    //view File is to check photo upload and send photo to firebase
    const [photo, setPhoto] = useState('')
    const [viewFile, setViewFile] = useState('')

    //Practitioner Parameters
    const docGivenName = useRef(null) //Firstname
    const docFamilyName = useRef(null) //Lastname
    const docMidlleName = useRef(null) //add this to Firstname with a space
    const docMobileNo = useRef(null)
    const docEmail = useRef(null)
    const docAddress = useRef({
        houseNumber: null,
        state: null,
        district: null,
        city: null,
        postalCode: null
    })
    const docGender = useRef(null)
    const nmcRegdNo = useRef(null)
    //Firebase resource
    const [docPhoto, useDocPhoto] = useState('')

    //Functions
    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files[0]) {
            if (e.target.files[0].type.match(/image-*/)) {
                setPhoto(e.target.files[0]);
                setViewFile(URL.createObjectURL(e.target.files[0]))
            }
            else {
                alert('Not an image file')
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const uploadTask = storage.ref(`images/${photo.name}`).put(photo);
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
                    .child(photo.name)
                    .getDownloadURL()
                    .then(async (url) => {
                        const response = await fetch('http://localhost:7000/signup/patient', {
                            method: 'POST',
                            headers: {
                                'Content-type': 'application/json'
                            },
                            body: JSON.stringify({
                                address: address.current.value,
                                contactInfo: contactInfo.current.value,
                                dob: dob.current.value,
                                email: email.current.value,
                                emergencyContactName: emergencyContactName.current.value,
                                emergencyContactNo: emergencyContactNo.current.value,
                                emergencyContactRltn: emergencyContactRltn.current.value,
                                gender: gender.current.value,
                                occupation: occupation.current.value,
                                language: language.current.value,
                                maritalStatus: maritalStatus.current.value,
                                name: name.current.value,
                                zipCode: zipCode.current.value,
                                photo: url
                            })
                        })

                        console.log(response)
                    })

            }
        )

    }
    return (
        <div className="signUp">
            <Nav />
            <form id="SignUpForm" onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
                <input ref={name} type="text" id="name" placeholder="Name" required />
                <input ref={address} type="text" id="address" placeholder="Address" required />
                <input ref={email} type="email" id="email" placeholder="Email" required />
                <input ref={language} type="text" id="language" placeholder="Language" required />
                <div className="signUp__radio">
                    <h5>Marital Status:</h5>
                    <label htmlFor="Married">
                        <input ref={maritalStatus} type="radio" id="Married" value="Married" name="Marital Status" onClick={() => { maritalStatus.current.value = "Married" }} required />
                        Married
                    </label>
                    <label htmlFor="Single">
                        <input ref={maritalStatus} type="radio" id="Single" value="Single" name="Marital Status" onClick={() => { maritalStatus.current.value = "Single" }} required />
                        Single
                    </label>
                </div>
                <input ref={zipCode} type="text" id="zipCode" placeholder="Zip-Code" required />
                <input ref={dob} type="date" onChange={()=>{console.log(dob.current.value)}} id="dob" placeholder="Date of Birth" required />
                <input ref={contactInfo} type="text" id="contactInfo" placeholder="Contact Number" required />
                <input type="file" accept="image/*" id="image" alt="Profile photo" onChange={handleChange} required />
                <img src={viewFile} style={{ height: '81px', width: '256px' }} alt="Uploaded" />
                <input ref={occupation} id="Occupation" type="text" placeholder="Occupation" required />
                <div className="signUp__select">
                    <h4>Gender</h4>
                    <div className="signUp__customSelect">
                        <select ref={gender} defaultChecked="Select Gender" id="gender" required>
                            <option value="Select Gender" hidden > Please Select Your Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
                <div className="signUp__emergency">
                    <h4>Emergency contact</h4>
                    <hr />
                    <input ref={emergencyContactName} id="emergencyContactName" type="text" placeholder="Name" required />
                    <input ref={emergencyContactNo} type="text" id="emergencyContactInfo" placeholder="Contact info" required />
                    <input ref={emergencyContactRltn} type="text" id='relation' placeholder="Relation" required />
                </div>
                <button type="submit" id='submit' form="SignUpForm">Sign Up</button>
            </form>
        </div>
    )
}

export default SignUp
