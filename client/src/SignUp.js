import React, { useRef, useState } from 'react'
import Nav from './Nav'
import "./SignUp.scss"

function SignUp() {
    const address = useRef(null)
    const contactInfo = useRef(null)
    const dob = useRef(null)
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
    const [url, setUrl]=useState('')
    const [viewFile, setViewFile]= useState('')

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

    const handleSubmit=async(e)=>{
        e.preventDefault()
        const response= await fetch('http://localhost:7000/signup/patient',{
            method: 'POST',
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify({
                address:address.current.value,
                contactInfo:contactInfo.current.value,
                dob:dob.current.value,
                email:email.current.value,
                emergencyContactName:emergencyContactName.current.value,
                emergencyContactNo:emergencyContactNo.current.value,
                emergencyContactRltn:emergencyContactRltn.current.value,
                gender:gender.current.value,
                occupation:occupation.current.value,
                language:language.current.value,
                maritalStatus:maritalStatus.current.value,
                name:name.current.value,
                zipCode:zipCode.current.value,
                photo:viewFile
            })
        })
        console.log(response)
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
                        <input ref={maritalStatus} type="radio" id="Married"  value="Married" name="Marital Status" onClick={()=>{maritalStatus.current.value="Married"} } required />
                        Married
                    </label>
                    <label htmlFor="Single">
                        <input ref={maritalStatus} type="radio" id="Single"  value="Single" name="Marital Status" onClick={()=>{maritalStatus.current.value="Single"}}  required />
                        Single
                    </label>
                </div>
                <input ref={zipCode} type="text" id="zipCode" placeholder="Zip-Code" required />
                <input ref={dob} type="date" id="dob" placeholder="Date of Birth" required />
                <input ref={contactInfo} type="text" id="contactInfo" placeholder="Contact Number" required />
                <input type="file" accept="image/*" alt="Profile photo" onChange={handleChange} required />
                <img src={viewFile} style={{height:'81px', width:'256px'}} alt="Uploaded"/>
                <input ref={occupation} type="text" placeholder="Occupation" required />
                <div className="signUp__select">
                    <h4>Gender</h4>
                    <div className="signUp__customSelect">
                        <select ref={gender} defaultChecked="Please Select Your Gender" id="gender" required>
                            <option hidden disabled> Please Select Your Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
                <div className="signUp__emergency">
                    <h4>Emergency contact</h4>
                    <hr />
                    <input ref={emergencyContactName} type="text" placeholder="Name" required />
                    <input ref={emergencyContactNo} type="text" id="contactInfo" placeholder="Contact info" required />
                    <input ref={emergencyContactRltn} type="text" placeholder="Relation" required />
                </div>
                <button type="submit" form="SignUpForm">Sign Up</button>
            </form>
        </div>
    )
}

export default SignUp
