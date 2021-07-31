import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import "./ShareDocuments.scss"
import {TrashIcon} from "@heroicons/react/outline"
import { deleteShareDocs } from './features/counterSlice';
function ShareDocuments() {
    const documentsList=useSelector(state=>state.user.shareDocuments);
    const dispatch=useDispatch();
    const [dummy, setdummy] = useState(false);
    const [doctorData,setdoctorData]=useState([]);
    useEffect(() => {
        async function getDoctor(){
            const response=await fetch("http://localhost:7000/search/doctor",{
                method:"GET"
            });
            const data=await response.json();
            console.log(data)
            setdoctorData(data)
        }
        return getDoctor();
    }, [])
    return (
        <div className="shareDocuments">
            <h1>List of Documents to be shared</h1>
            {Object.keys(documentsList).map((key)=>{
                return(<div className="shareDocuments__list">
                    <p>{documentsList[key].category}</p>
                    <p>{documentsList[key].date}</p>
                    <p>{documentsList[key].hospitalName}</p>
                    <TrashIcon className="shareDocuments__trashIcon"
                    onClick={()=>{
                        dispatch(deleteShareDocs(documentsList[key]));
                        setdummy(!dummy)
                    }}
                    />
                </div>)
            })}
            <div className="shareDocuments__shareButton">
                <button>Share</button>
            </div>
            <div className="shareDocuments__popup">
                <input type="time" />
                <input  type="search" placeholder="Input the name of the doctor" />
                <div className="shareDocuments__searchedData">
                    {Object.keys(doctorData).map((key)=>{
                        return (
                            <div className="shareDocuments__doctorInfo">
                                <img src={doctorData[key].photo} alt="Doctor Photo" srcset="" />
                                <p>{doctorData[key].name}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default ShareDocuments
