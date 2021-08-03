import React, { useEffect, useState } from 'react'
import "./SharedDocuments.scss"
import {TrashIcon} from "@heroicons/react/outline"
function SharedDocuments() {
    const [sharedDocuments, setsharedDocuments] = useState([])
    useEffect(() => {
        async function getSharedDocuments(){
            const response=await fetch("http://localhost:7000/share/recentdocuments?patientId=20000707-513569",{
                method:"GET"
            });
            const data=await response.json();
            console.log(data)
            setsharedDocuments(data)
        }
        return getSharedDocuments() 
    }, [])
    return (
        <div className="sharedDocuments">
            <div className="sharedDocuments__list">
                {Object.keys(sharedDocuments).map((key)=>{
                return(
                    <div key={key} className="sharedDocuments__document">
                        <p>{sharedDocuments[key].title}</p>
                        <p>{sharedDocuments[key].sharedDate.slice(0,16)}</p>
                        <p>Remaining Time: {Math.floor(sharedDocuments[key].timeStamp - Date.now()/60000) } min </p>
                        <TrashIcon className="sharedDocuments__trashIcon" />
                    </div>
                )
                })}
            </div>
            
            
        </div>
    )
}

export default SharedDocuments
