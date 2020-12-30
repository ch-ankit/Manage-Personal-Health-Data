import React, { useState } from 'react'
import './SignUp.css';

function SignUp() {
    const [empId, setempId] = useState('');
    const [Name, setName] = useState('');
    const [Phone, setPhone] = useState('');
    const [Job, setJob] = useState('Doctor')
    const [Address, setAddress] = useState('')
    const [Email, setEmail] = useState('')
    const [Password, setPassword] = useState('')
    const [Qual, setQual] = useState('')
    return (
        <div className='SignUp'>
            <div className='SignUp__Box'>
                <h1>Sign Up</h1>
                <div className='SignUp__Input'>
                <select onChange={(e)=>setJob(e.target.value)}>
                    <option>Doctor</option>
                    <option>Nurse</option>
                    <option>Mangement-Staff</option>
                    <option>Patient</option>
                </select>
                <input type='text' value={empId} onChange={(e)=>setempId(e.target.value)} placeholder='empId or PatientId ' />
                <input type='text' value={Name} onChange={(e)=>setName(e.target.value)} placeholder='Name' />
                <input type='email' value={Email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" />
                <input type='password' value={Password} onChange={(e)=>setPassword(e.target.value)} placeholder='Password' />
                <input type='number' value={Phone} onChange={(e)=>
                    setPhone(e.target.value.substr(0,10))
                    }  placeholder='Contact no'/>
                <input type='text' value={Address} onChange={(e)=>setAddress(e.target.value)} placeholder='Address' />
                {
                    Job!='Patient'?
                    (
                    <input type='text' value={Qual} onChange={(e)=>setQual(e.target.value)} placeholder='Qualification' />
                    ):''
                }
                <button>Sign Up</button>
                </div>
            </div>
        </div>
    )
}

export default SignUp
