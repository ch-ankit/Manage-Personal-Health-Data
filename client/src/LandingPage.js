import React, { useRef } from 'react'
import Staff from "./images/staff.png"
import Nav from "./Nav.js"
import "./LandingPage.scss"
import { useHistory } from 'react-router-dom';
import  {useDispatch} from "react-redux";
import {login} from "./features/counterSlice"
function LandingPage() {
    const password=useRef(null);
    const email=useRef(null);
    const history=useHistory();
    const dispatch=useDispatch();
    const logIn=async(e)=>{
        e.preventDefault();
        const response=await fetch("https://jsonplaceholder.typicode.com/users",{
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({
                email:email.current.value,
            })  
        });
        const data=await response.json();
        dispatch(login(data));
        console.log(data);
        history.push('/home')
    }
    return (
        <div className="landingPage">
            <Nav />
            <div className="landingPage__content">
                <h1>Medical History of Patient</h1>
                <p>Where you can access the history of patient</p>
            </div>
            <form className="landingPage__login" onSubmit={logIn}>
                <h1>Log In</h1>
                <input ref={email} type="email" id="Email" placeholder="Email" aria-label="Email"/>
                <input ref={password} type="password" id="Password" placeholder="Password" aria-label="Password"/>
                <button type="submit" id="logIn">Log In</button>
            </form>
            <div className="landingPage__imgBox">
                <img src={Staff} alt=""/>
            </div>
        </div>
    )
}

export default LandingPage
