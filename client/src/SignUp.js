import React, { useRef, useState } from 'react'
import storage from './firebaseConfig'
import Nav from './Nav'
import "./SignUp.scss"

function SignUp() {
    //Patient parameters
    const city = useRef(null)
    const district = useRef(null)
    const state = useRef(null)
    const country = useRef(null)
    const mobileNo = useRef(null)
    const houseNo = useRef(null)
    const streetName = useRef(null)
    const dob = useRef(null);
    const email = useRef(null)
    const emergencyContactName = useRef(null)
    const emergencyContactNo = useRef(null)
    const emergencyContactRltn = useRef(null)
    const gender = useRef(null)
    const occupation = useRef(null)
    const language = useRef(null)
    const maritalStatus = useRef(null)
    const multipleBirthBoolean = useRef(null)
    const birthOrder = useRef(null)
    const firstName = useRef(null)
    const middleName = useRef(null)
    const lastName = useRef(null)
    const prefix = useRef(null)
    const suffix = useRef(null)
    const postalCode = useRef(null)
    //view File is to check photo upload and send photo to firebase
    const [photo, setPhoto] = useState('')
    const [viewFile, setViewFile] = useState('')

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
                                city: city.current.value,
                                district: district.current.value,
                                state: state.current.value,
                                country: country.current.value,
                                mobileNo: mobileNo.current.value,
                                houseNo: houseNo.current.value,
                                streetName: streetName.current.value,
                                dob: dob.current.value,
                                email: email.current.value,
                                emergencyContactName: emergencyContactName.current.value,
                                emergencyContactNo: emergencyContactNo.current.value,
                                emergencyContactRltn: emergencyContactRltn.current.value,
                                gender: gender.current.value,
                                occupation: occupation.current.value,
                                language: language.current.value,
                                maritalStatus: maritalStatus.current.value,
                                multipleBirthBoolean: multipleBirthBoolean.current.value,
                                birthOrder: birthOrder.current.value,
                                firstName: firstName.current.value,
                                middleName: middleName.current.value,
                                lastName: lastName.current.value,
                                prefix: prefix.current.value,
                                suffix: suffix.current.value,
                                postalCode: postalCode.current.value,
                                photo: url
                            })
                        })
                        setViewFile('')
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
                <input ref={firstName} type="text" id="name" placeholder="First Name" required />
                <input ref={middleName} type="text" id="name" placeholder="Middle Name" required />
                <input ref={lastName} type="text" id="name" placeholder="Last Name" required />
                <input ref={streetName} type="text" id="address" placeholder="Street" required />
                <input ref={houseNo} type="text" id="address" placeholder="House/Appartment Number" required />
                <input ref={city} type="text" id="address" placeholder="City" required />
                <input ref={district} type="text" id="address" placeholder="District" required />
                <input ref={state} type="text" id="address" placeholder="State" required />
                <input ref={country} type="text" id="address" placeholder="Country" required />
                <input ref={email} type="email" id="email" placeholder="Email" required />
                <input ref={language} type="text" id="language" placeholder="Language" required />
                <div className="signUp__radio">
                    <h5>Multiple Birth?</h5>
                    <label htmlFor="yes">
                        <input ref={maritalStatus} type="radio" id="yes" value={true} name="Marital Status" onClick={() => { multipleBirthBoolean.current.value = true }} required />
                        Yes
                    </label>
                    <label htmlFor="no">
                        <input ref={maritalStatus} type="radio" id="no" value={false} name="Marital Status" onClick={() => { multipleBirthBoolean.current.value = false }} required />
                        No
                    </label>
                </div>
                {/* {multipleBirthBoolean.current.value ??
                    <div>
                        Enter Your Birth Order:
                    <input useRef={birthOrder} type='text' placeholder="Birth Order" />
                    </div>
                } */}
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
                <input ref={postalCode} type="text" id="postalCode" placeholder="Postal Code" required />
                <input ref={dob} type="date" onChange={() => { console.log(dob.current.value) }} id="dob" placeholder="Date of Birth" required />
                <input ref={mobileNo} type="text" id="contactInfo" placeholder="Mobile Number" required />
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
