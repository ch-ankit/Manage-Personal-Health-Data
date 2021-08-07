import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import "./PersonalDetail.scss"
import { useHistory } from 'react-router-dom'
import { languages } from './LanguageDataset'
import storage from './firebaseConfig'
function PersonalDetail() {
    const userData = useSelector((state) => state.user.value);
    const darkMode = useSelector((state) => state.user.darkMode);
    const history = useHistory();
    const address = useRef(null)
    const city = useRef(null)
    const district = useRef(null)
    const state = useRef(null)
    const country = useRef(null)
    const mobileNo = useRef(null)
    const dob = useRef(null);
    const email = useRef(null)
    const emergencyContactName = useRef(null)
    const emergencyContactNo = useRef(null)
    const emergencyContactRltn = useRef(null)
    const gender = useRef(null)
    const occupation = useRef(null)
    const language = useRef(null)
    const firstName = useRef(null)
    const middleName = useRef(null)
    const lastName = useRef(null)
    const postalCode = useRef(null)
    const houseNo = useRef(null)
    const streetName = useRef(null)
    const [customPrefix, setCustomPrefix] = useState(false)
    const [customSuffix, setCustomSuffix] = useState(false)
    const prefix = useRef(null)
    const suffix = useRef(null)
    const birthOrder = useRef(null)
    const [maritalStatus, setMaritalStatus] = useState('')
    const [multipleBirthBoolean, setMultipleBirthBoolean] = useState(false)
    const maritalStatusCode=useRef(null)
    const [viewFile, setViewFile] = useState(userData.photo);
    const [photo, setPhoto] = useState('')



    if (userData == null) {
        history.push('/')
    }
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
                        const response = await fetch('http://localhost:7000/signUp/patient', {
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
                                language: system[0],
                                languageCode: system[1],
                                maritialStatus: maritalStatus,
                                maritialStatusCode: maritalStatusCode.current.value,
                                multipleBirthBoolean: multipleBirthBoolean,
                                birthOrder: multipleBirthBoolean ? birthOrder.current.value : 1,
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
    const languageMap = Object.keys(languages).map(el => <option key={el} value={`${languages[el].name}-${languages[el].code}`} > {languages[el].name}</ option>)
    return (
        <div className="personalDetail">
            {console.log(darkMode)}
            <h2>Profile</h2>

            <div className="personalDetail__content">
                <div className="personalDetail__button">
                    <h2 style={{marginTop:"0.7em"}}>Profile Demographics</h2>
                    <button onClick={() => {
                        document.querySelector('.personalDetail__popup').classList.toggle('active')
                    }}>Change</button>
                </div>
                <div className="personalDetail__detail">
                    <div className="personalDetail__who">
                        <h4>Who</h4>
                        <div className="personalDetail__who1">
                            <p>{userData?.firstName+ ' ' + userData?.lastName}</p>              {/* display name of the user */}
                            <p>Sex : {userData?.gender}</p>                   {/* display sex of the user */}
                            <p>Marital Status: {userData?.maritalStatus} </p>      {/* display maarital status of the user */}
                        </div>
                        <div className="personalDetail__who2">
                            <p>DOB: {userData?.birthDate}</p>              {/* display the DOB of the user */}
                        </div>
                    </div>
                    <div className="personalDetail__contact">
                        <h4>Contact</h4>
                        <div className="personalDetail__contact1">
                            <p>Address: {userData?.addressbothcity}</p>          {/* display the address of the user */}
                            <p>Country: {(userData?.addresspermanentcountry) ?? (userData?.addressbothcountry)}</p> 
                            <p>Mobile Phone: {userData?.phone}</p>     {/* display mobile number of user */}
                        </div>
                        <div className="personalDetail__contact2">
                            <p>Zip Code: {userData?.addressbothpostalCode}</p>              {/* display the zip code */}
                            <p>Email: {userData?.email}</p>   {/* display user email */}
                        </div>
                    </div>
                </div>
            </div>
            <div className="personalDetail__popup">
                <form id="personalDetailForm" onSubmit={handleSubmit}>
                    <h1>
                        <span>Change you personal Detail</span>
                        <span onClick={() => {
                            document.querySelector(".personalDetail__popup.active").classList.remove('active')
                        }} style={{ cursor: "pointer" }}>X</span>
                    </h1>
                    <div className="personalDetail__customSelect" style={{ display: `${customPrefix ? 'none' : 'flex'}`,width:"80%" }}>
                    <label>Prefix</label>
                    <select ref={prefix}  id="prefix" >
                        <option selected="selected">{userData.prefix}</option>
                        <option value="Mr."> Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Dr.">Dr.</option>
                        <option value="Er.">Er.</option>
                        <option value="Prof.">Prof.</option>
                        <option value="custom" onClick={() => setCustomPrefix(true)}>Custom</option>
                    </select>
                </div>
                {
                    customPrefix ?
                        <input ref={prefix} type="text" id="prefix" placeholder="Prefix" required /> : ''
                }
                    <div className="personalDetail__changeName">
                        <label htmlFor="firstname">First Name
                        <input ref={firstName} type="text" id="firstname" defaultValue={userData?.firstName} placeholder="First Name" />
                        </label>
                        <label htmlFor="middlename">Middle Name
                        <input ref={middleName} type="text" id="middlename" defaultValue={userData?.middleName} placeholder="Middle Name" />
                        </label>
                        <label htmlFor="lastname">Last Name
                        <input ref={lastName} type="text" id="lastname" defaultValue={userData?.lastName} placeholder=" Last Name" />
                        </label>
                    </div>
                    <div className="personalDetail__customSelect" style={{ display: `${customSuffix ? 'none' : 'flex'}`,width:"80%" }}>
                        <label>Suffix</label>
                        <select ref={suffix} id="suffix" required>
                            <option selected="selected">{userData.suffix}</option>
                            <option value="Phd."> Phd.</option>
                            <option value="MD">MD</option>
                            <option value="MS">MS</option>
                            <option value="custom" onClick={() => setCustomSuffix(true)}>Custom</option>
                        </select>
                    </div>
                    {
                        customSuffix ?
                            <input ref={suffix} type="text" id="suffix" placeholder="Suffix" required /> : ''
                    }
                    <div className="personalDetail__changeAddress">
                        {console.log(userData)}
                        <label>Street Name   
                            <input ref={streetName} type="text" defaultValue={userData.addressbothline[1]} id="address" placeholder="Street" required />
                        </label>
                        <label>
                            House No
                            <input ref={houseNo} type="text" defaultValue={userData.addressbothline[0]} id="address" placeholder="House/Appartment Number" required />
                        </label>
                        <label>
                            City
                            <input ref={city} type="text" defaultValue={userData.addressbothcity} id="address" placeholder="City" required />
                        </label>    
                        <label>
                            District
                            <input ref={district} type="text" defaultValue={userData.addressbothdistrict} id="address" placeholder="District" required />
                        </label>
                        <label>
                            State
                            <input ref={state} type="text" defaultValue={userData.addressbothstate} id="address" placeholder="State" required />
                        </label>
                        <label>
                            Country
                            <input ref={country} type="text" defaultValue={userData.addressbothcountry} id="address" placeholder="Country" required />
                        </label>
                    </div>

                    <label htmlFor="email" style={{width:"80%"}}>Email
                    <input ref={email} style={{height:"2.5em",marginTop:"0.5rem"}} type="email"  defaultValue={userData?.email} id="email" placeholder="Email" />
                    </label>
                    <div className="personalDetail__customSelect" style={{width:'80%'}}>
                        <label htmlFor="">Language</label>
                        <select ref={language}  id="language" required>
                            <option selected="selected" >{userData.language}</option>
                            {languageMap}
                        </select>
                    </div>
                    <div className="personalDetail__radio">
                    <h5>Multiple Birth?</h5>
                    <label htmlFor="yes">
                        <input type="radio" style={{height:"2.5em",marginTop:"0.5rem"}} defaultChecked={userData.multipleBirthBoolean} id="yes" value={true} name="Marital Status" onClick={() => { setMultipleBirthBoolean(true) }} required />
                        Yes
                    </label>
                    <label htmlFor="no">
                        <input type="radio" style={{height:"2.5em",marginTop:"0.5rem"}} defaultChecked={!userData.multipleBirthBoolean}  id="no" value={false} name="Marital Status" onClick={() => { setMultipleBirthBoolean(false) }} required />
                        No
                    </label>
                </div>
                {
                    multipleBirthBoolean ?
                        <div>
                            Enter Your Birth Order:
                            <input ref={birthOrder} type='text' placeholder="Birth Order" />
                        </div> : ''
                }
                    <div className="personalDetail__radio" style={{display:"flex",flexDirection:"column",width:"80%"}}>
                    <div className="personalDetail__customSelect">
                        <label htmlFor="">Marital Status</label>
                        <select ref={maritalStatusCode} defaultChecked={userData.maritalStatus.slice(0,1)} id="Marital Status" required>
                            <option selected="selected">{userData?.maritalStatus}</option>
                            <option value="Marital Status" hidden > Please Select you status</option>
                            <option value="A" onClick={() => setMaritalStatus('Annuled')} >Annuled</option>
                            <option value="D" onClick={() => setMaritalStatus('Divorced')} >Divorced</option>
                            <option value="I" onClick={() => setMaritalStatus('Interlocutory')} >Interlocutory</option>
                            <option value="L" onClick={() => setMaritalStatus('Legally Separated')} >Legally Seperated</option>
                            <option value="M" onClick={() => setMaritalStatus('Married')} >Married</option>
                            <option value="P" onClick={() => setMaritalStatus('Polygamous')} >Polygamous</option>
                            <option value="S" onClick={() => setMaritalStatus('Never Married')} >Never Married</option>
                            <option value="T" onClick={() => setMaritalStatus('Domestic Partner')} >Domestic Partner</option>
                            <option value="U" onClick={() => setMaritalStatus('Unmarried')} >Unmarried</option>
                            <option value="W" onClick={() => setMaritalStatus('Widowed')} >Widowed</option>
                            <option value="UNK" onClick={() => setMaritalStatus('unknown')} >unknown</option>
                        </select>
                    </div>
                </div>
                    <label htmlFor="zipCode" style={{width:"80%"}}>Zip code
                        <input ref={postalCode} style={{height:"2.5em",marginTop:"0.5rem"}} type="text" defaultValue={userData?.addressbothpostalCode} id="zipCode" placeholder="Zip-Code" />
                    </label>
                    <label htmlFor="dob" style={{width:"80%"}}>DOB
                        <input ref={dob} style={{height:"2.5em",marginTop:"0.5rem"}} type="date" defaultValue={userData?.birthDate} id="dob" placeholder="Date of Birth" />
                    </label>
                    <label htmlFor="contactInfo" style={{width:"80%"}}>ContactInfo
                        <input ref={mobileNo} style={{height:"2.5em",marginTop:"0.5rem"}} type="text" defaultValue={userData?.phone} id="contactInfo" placeholder="Contact Number" />
                    </label>
                    <div className="personalDetail__changePhoto">
                    <input type="file" accept="image/*" alt="Profile photo" onChange={handleChange} />
                    <img loading="lazy" src={viewFile} style={{ height: '81px', width: '256px' }} className={`image ${darkMode && "imageDark"}`} alt="Uploaded" />
                    </div>
                        
                    <div className="personalDetail__select">
                        <div className="personalDetail__customSelect">
                            <label htmlFor="">Gender</label>
                            <select ref={gender} id="gender" >
                                <option selected="selected">{userData?.gender}</option>
                                <option value="Female">Female</option>
                                <option value="Male">Male</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    {/* <div className="personalDetail__emergency">
                        <h4>Emergency contact</h4>
                        <hr />
                        <div>
                            <label htmlFor="emergencyContactName">Name
                    <input ref={emergencyContactName} type="text" defaultValue={userData?.emergencyContactName} placeholder="Name" />
                            </label>
                            <label htmlFor="emergencyContactNo">Contact No
                    <input ref={emergencyContactNo} type="text" id="contactInfo" defaultValue={userData?.emergencyContactNo} placeholder="Contact info" />
                            </label>
                            <label htmlFor="emergencyContactRltn">Contact Relation
                    <input ref={emergencyContactRltn} type="text" defaultValue={userData?.emergencyContactRltn} placeholder="Relation" />
                            </label>
                        </div>
                    </div> */}
                    <button type="submit" form="personalDetailForm">Change</button>
                </form>
            </div>
        </div>
    )
}

export default PersonalDetail
