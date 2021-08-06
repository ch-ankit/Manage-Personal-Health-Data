import React, { useRef, useState } from 'react'
import storage from './firebaseConfig'
import Nav from './Nav'
import "./SignUpDoc.scss"
import { languages } from './LanguageDataset'


function SignUp() {
    //Practitioner Parameters
    const firstName = useRef(null) //Firstname
    const lastName = useRef(null) //Lastname
    const middleName = useRef(null) //add this to Firstname with a space
    const prefix = useRef(null) //add this to Firstname with a space
    const suffix = useRef(null) //add this to Firstname with a space
    const dob = useRef(null)
    const mobileNo = useRef(null)
    const email = useRef(null)
    const streetName = useRef(null)
    const houseNo = useRef(null)
    const state = useRef(null)
    const district = useRef(null)
    const city = useRef(null)
    const country = useRef(null)
    const language = useRef(null)
    const postalCode = useRef(null)
    const gender = useRef(null)
    const id = useRef(null)
    const periodStart = useRef(null)
    //Firebase resource
    const [photo, setPhoto] = useState('')
    const [viewFile, setViewFile] = useState('')
    const [customPrefix, setCustomPrefix] = useState(false)
    const [customSuffix, setCustomSuffix] = useState(false)

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
                        const system = language.current.value.split('-')
                        const qualificationCodeSystem = 'https://nmc.org.np/searchPractitioner'
                        const qualificationCodeCode = "R"
                        const qualificationCodeDisplay = 'Qualified doctor'
                        const qualificationCodetext = `Dr.${firstName.current.value} is a registered doctor in NMC`
                        const qualificationIdentifierSystem = 'https://nmc.org.np/searchPractitioner'
                        const qualificationIdentifierValue = id.current.value
                        const issuer = "Nepal Medical Council"
                        const response = await fetch('http://localhost:7000/signup/doctor', {
                            method: 'POST',
                            headers: {
                                'Content-type': 'application/json'
                            },
                            body: JSON.stringify({
                                firstName: firstName.current.value,
                                lastName: lastName.current.value,
                                middleName: middleName.current.value,
                                prefix: prefix.current.value,
                                suffix: suffix.current.value,
                                dob: dob.current.value,
                                mobileNo: mobileNo.current.value,
                                email: email.current.value,
                                streetName: streetName.current.value,
                                houseNo: houseNo.current.value,
                                state: state.current.value,
                                district: district.current.value,
                                city: city.current.value,
                                country: country.current.value,
                                language: system[0],
                                languageCode: system[1],
                                postalCode: postalCode.current.value,
                                gender: gender.current.value,
                                id: id.current.value,
                                periodStart: periodStart.current.value,
                                qualificationCodeSystem: qualificationCodeSystem,
                                qualificationCodeCode: qualificationCodeCode,
                                qualificationCodeDisplay: qualificationCodeDisplay,
                                qualificationCodetext: qualificationCodetext,
                                qualificationIdentifierSystem: qualificationIdentifierSystem,
                                qualificationIdentifierValue: qualificationIdentifierValue,
                                issuer: issuer,
                                photo: photo
                            })
                        })

                        console.log(response)
                    })

            }
        )

    }
    const languageMap = Object.keys(languages).map(el => <option key={el} value={`${languages[el].name}-${languages[el].code}`} > {languages[el].name}</ option>)
    return (
        <div className="signUpDoc">
            <Nav />
            <form id="SignUpForm" onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
                <div className="signUpForm__name">
                    <div className="signUp__select" style={{ display: `${customPrefix ? 'none' : 'flex'}` }}>
                        <div className="signUp__customSelect">
                            <select ref={prefix} defaultChecked="Prefix" id="prefix" >
                                <option value="Prefix" hidden >Prefix</option>
                                <option value="Mr."> Mr.</option>
                                <option value="Mrs.">Mrs.</option>
                                <option value="Ms.">Ms.</option>
                                <option value="Dr.">Dr.</option>
                                <option value="Er.">Er.</option>
                                <option value="Prof.">Prof.</option>
                                <option value="custom" onClick={() => setCustomPrefix(true)}>Custom</option>
                            </select>
                        </div>
                    </div>
                    {
                        customPrefix ?
                            <input ref={prefix} type="text" id="prefix" placeholder="Prefix" required /> : ''
                    }
                    <input ref={firstName} type="text" id="name" placeholder="First Name" required />
                    <input ref={middleName} type="text" id="name" placeholder="Middle Name" />
                    <input ref={lastName} type="text" id="name" placeholder="Last Name" required />
                    <div className="signUp__select" style={{ display: `${customSuffix ? 'none' : 'flex'}` }}>
                        <div className="signUp__customSelect">
                            <select ref={suffix} defaultChecked="Suffix" id="suffix" >
                                <option value="Suffix" hidden > Please Select your Suffix</option>
                                <option value="Phd."> Phd.</option>
                                <option value="MD">MD</option>
                                <option value="MS">MS</option>
                                <option value="custom" onClick={() => setCustomSuffix(true)}>Custom</option>
                            </select>
                        </div>
                    </div>
                    {
                        customSuffix ?
                            <input ref={suffix} type="text" id="suffix" placeholder="Suffix" required /> : ''
                    }
                </div>
                <div className="signUpForm__address">
                    <input ref={city} type="text" id="city" placeholder="City" required />
                    <input ref={district} type="text" id="district" placeholder="District" required />
                    <input ref={state} type="text" id="state" placeholder="State" required />
                    <input ref={country} type="text" id="country" placeholder="country" required />
                    <input ref={houseNo} type="text" id="houseNumber" placeholder="House/Appartment Number" />
                    <input ref={streetName} type="text" id="streetName" placeholder="Street Name" />
                </div>

                <input ref={postalCode} type="text" id="postalCode" placeholder="Postal Code" required />

                <input ref={email} type="email" id="email" placeholder="Email" required />
                <div className="signUpDoc__dob">
                    <label>D.O.B</label>
                    <input ref={dob} type="date" onChange={() => { console.log(dob.current.value) }} id="dob" placeholder="Date of Birth" required />
                </div>
                <input ref={mobileNo} type="text" id="mobileNo" placeholder="Contact Number" required />

                <input ref={id} type="text" id="id" placeholder="NMC Registration Number" required />
                <div className="signUpDoc__nmcDate">
                    <label>NMC Registered Date</label>
                    <input ref={periodStart} type="date" id="nmcDate" placeholder="NMC Registered Date" required />
                </div>
                
                <div className="signUp__select">
                    <div className="signUp__customSelect">
                        <select ref={language} defaultChecked="Language" id="language" required>
                            <option value="Language" hidden > Please Select preferred Language</option>
                            {languageMap}
                        </select>
                    </div>
                </div>
                <input type="file" accept="image/*" id="image" alt="Profile photo" onChange={handleChange} required />
                <img src={viewFile} style={{ height: '81px', width: '256px' }} alt="Uploaded" />
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
                <button type="submit" id='submit' form="SignUpForm">Sign Up</button>
            </form>
        </div>
    )
}

export default SignUp
