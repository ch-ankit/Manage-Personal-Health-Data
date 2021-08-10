import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import EmergencyContact from "./EmergencyContact"
import "./EmergencyContactView.scss"
function EmergencyContactView() {
    const userData = useSelector((state) => state.user.value);
    const [emergencyContact, setemergencyContact] = useState([])
    const dummy=useSelector(state=>state.user.dummy);
    console.log(dummy)
    useEffect(() => {
        async function getEmergencyContact(){
            const response=await fetch(`http://localhost:7000/signup/getcontact?id=${userData?.uId}`,{
                method:"GET"
            });
            const data=await response.json();
            console.log(data)
            setemergencyContact(data);
        }
        return  getEmergencyContact();
    }, [dummy])
    return (
        <div className="emergencyContactView">
            <div className="emergencyContactView__button">
                <h2>Emergency contact</h2>
                <button
                onClick={()=>document.querySelector(".emergencyContactView__addContact").classList.toggle("active")}
                >
                    Add
                </button>
            </div>
            {emergencyContact?.message==="emergency contact not added"?<h3 style={{width:"100%",textAlign:"center",marginTop:"1em"}}> No emergency contact added </h3>:Object.keys(emergencyContact).map((key)=>{
                return(
                    <div className="emergencyContactView__gridView">
                <div className="emergencyContactView__who">
                    <h4>Who</h4>
                    <div className="emergencyContactView__who1">
                        <p>{emergencyContact[key].given[0].replace(/\"/g,"") + " " + emergencyContact[key].family.replace(/\"/g,"")}</p>
                        <p>Sex: {emergencyContact[key].gender.replace(/\"/g,"")}</p>
                    </div>
                </div>
                <div className="emergencyContactView__contact">
                    <h4>Contact</h4>
                    <div className="emergencyContactView__contact1">
                        <p>Address: {emergencyContact[key].text.replace(/\"/g,"")}</p>
                        <p>Phone: {emergencyContact[key].contactNo.replace(/\"/g,"")}</p>
                    </div>
                </div>
            </div>
                )
            })
            }
            

                <div className="emergencyContactView__addContact">
                <h1 onClick={() => {
                            document.querySelector(".emergencyContactView__addContact.active").classList.remove('active')
                        }} style={{ cursor: "pointer" }}>X</h1>
                    <EmergencyContact />
                </div>
        </div>
    )
}

export default EmergencyContactView
