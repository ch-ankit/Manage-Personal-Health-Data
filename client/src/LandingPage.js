import React, { useRef } from 'react'
import Staff from "./images/staff.png"
import Nav from "./Nav.js"
import "./LandingPage.scss"
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { loginDoc, loginUser } from "./features/counterSlice"
function LandingPage() {
    const userpassword = useRef(null);
    const userid = useRef(null);
    const docid=useRef(null);
    const docpassword= useRef(null);
    const history = useHistory();
    const dispatch = useDispatch();
    const userData = useSelector(state => state.user.value);
    const doctorData = useSelector(state => state.user.doctor);

    if (userData != null) {
        history.push('/home')
    }

    if (doctorData != null) {
        history.push('/doctor')
    }
    const logInUser = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch("http://localhost:7000/login/patient", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    id: userid.current.value,
                    password: userpassword.current.value
                })
            });
            console.log(response)
            console.log('Hello')
            const data = await response.json();
            console.log(data)
            let patientData={};
            patientData.uId=data.identifier[0].value;
            patientData.birthDate=data.birthDate;
            patientData.gender=data.gender;
            patientData.firstName=data.name[0].given[0];
            patientData.lastName=data.name[0].family;
            data.telecom.forEach((tel)=>
                patientData[tel.system]=tel.value
            )
            patientData.maritalStatus=data.maritialStatus.text;
            patientData.photo=data.photo.url;
            data.address.forEach((val)=>{
                let arr=Object.getOwnPropertyNames(val);
                arr.forEach((name)=>{
                    patientData[`address${val.type}${name}`]=val[name]
                })
            })
            console.log(data);
            console.log(patientData)
            dispatch(loginUser(patientData));
        }
        catch(err){
            alert('Username or Password Incorrect')
        }
        
    }
    const logInDoctor = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch("http://localhost:7000/login/doctor", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    id: docid.current.value,
                    password: docpassword.current.value
                })
            });
            console.log(response)
            console.log('Hello')
            const data = await response.json();
            console.log(data)
            let docData={};
            docData.uId=data.identifier[0].value;
            docData.birthDate=data.birthDate;
            docData.gender=data.gender;
            docData.firstName=data.name[0].given[0];
            console.log(docData)
            docData.lastName=data.name[0].family;
            data.telecom.forEach((tel)=>
                docData[tel.system]=tel.value
            )
            console.log(docData)
            docData.photo=data.photo.url;
            data.address.forEach((val)=>{
                let arr=Object.getOwnPropertyNames(val);
                arr.forEach((name)=>{
                    docData[`address${val.type}${name}`]=val[name]
                })
            })
            console.log(data);
            console.log(docData)
            dispatch(loginDoc(docData));
        }
        catch(err){
            alert('Username or Password Incorrect')
        }
        
    }
    return (
        <div className="landingPage">
            <Nav />
            <div className="landingPage__select">
                <div className="landingPage__selectUser" onClick={()=>{
              document.querySelector('.landingPage__loginDoctor').classList.toggle('active');  
              document.querySelector('.circle').classList.toggle('active');  
            }}>
                    <div className="circle"></div>
                </div>
            </div>
            
            <div className="landingPage__content" >
                <h1>Manage Personal Health Data</h1>
                <p>Digitalizing your health data</p>
            </div>
            <form className="landingPage__loginUser" onSubmit={logInUser}>
                <h1>Log In User</h1>
                <input ref={userid} type="text" id="Email" placeholder="ID" aria-label="ID" />
                <input ref={userpassword} type="password" id="Password" placeholder="Password" aria-label="Password" />
                <button type="submit" id="logInUser">Log In</button>
            </form>
            <form className="landingPage__loginDoctor" onSubmit={logInDoctor}>
                <h1>Log In Doctor</h1>
                <input ref={docid} type="text" id="Email" placeholder="ID" aria-label="ID" />
                <input ref={docpassword} type="password" id="Password" placeholder="Password" aria-label="Password" />
                <button type="submit" id="logInDoc">Log In</button>
            </form>
            <div className="landingPage__imgBox">
                <img src={Staff} alt="Docs" />
            </div>
        </div>
    )
}

export default LandingPage
