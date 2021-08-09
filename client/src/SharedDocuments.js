import React, { useEffect, useState } from 'react'
import {useSelector} from "react-redux"
import "./SharedDocuments.scss"
import {TrashIcon} from "@heroicons/react/outline"
function SharedDocuments() {
    const [sharedDocuments, setsharedDocuments] = useState([])
    const userData=useSelector(state=>state.user.value);
    const [dummy, setdummy] = useState(true);
    useEffect(() => {
        async function getSharedDocuments(){
            const response=await fetch(`http://localhost:7000/share/recentdocuments?patientId=${userData.uId}`,{
                method:"GET"
            });
            const data=await response.json();
            console.log(data)
            setsharedDocuments(data)
        }
        return getSharedDocuments() 
    }, [dummy])
    async function terminateShare(data){
        const response=await fetch("http://localhost:7000/share/terminate",{
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({
                id:userData.uId,
                doctorId:data.doctorId,
                masterId:data.masterId
            })
        })
        setdummy(!dummy)
    }
    return (
        <div className="sharedDocuments">
            <h1>Shared Documents</h1>
            <div className="sharedDocuments__list">
                {Object.keys(sharedDocuments).map((key)=>{
                return(
                    <div key={key} className="sharedDocuments__document">
                        <p>{sharedDocuments[key].title}</p>
                        <p>{sharedDocuments[key].sharedDate.slice(0,16)}</p>
                        <p>Remaining Time: {Math.floor(sharedDocuments[key].timeStamp - Date.now()/60000) } min </p>
                        <TrashIcon onClick={()=>terminateShare(sharedDocuments[key])} className="sharedDocuments__trashIcon" />
                    </div>
                )
                })}
            </div>
            
            
        </div>
    )
}

export default SharedDocuments
