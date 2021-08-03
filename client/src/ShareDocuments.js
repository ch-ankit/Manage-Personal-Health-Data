import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import "./ShareDocuments.scss"
import { TrashIcon } from "@heroicons/react/outline"
import { deleteShareDocs, removeShareDocs } from './features/counterSlice';
function ShareDocuments() {
    const documentsList = useSelector(state => state.user.shareDocuments);
    console.log(documentsList)
    const userData = useSelector(state => state.user.value)
    const dispatch = useDispatch();
    const [dummy, setdummy] = useState(false);
    const [doctorData, setdoctorData] = useState([]);
    const [temporaryData, settemporaryData] = useState([])
    const timeNumber = useRef(null);
    const timeUnit = useRef(null)
    useEffect(() => {
        async function getDoctor() {
            const response = await fetch("http://localhost:7000/search/doctor", {
                method: "GET"
            });
            const data = await response.json();
            console.log(data)
            setdoctorData(data)
        }
        return getDoctor();
    }, [])

    const shareData = (docData, e) => {
        e.preventDefault();
        let accessTime;
        switch (timeUnit.current.value) {
            case "hr":
                accessTime = (timeNumber.current.value) * 60;
                break;
            case "day":
                accessTime = (timeNumber.current.value) * 1440;
                break;
            case "min":
                accessTime = timeNumber.current.value;
                break;
            default:
                console.log('Default case reached')
        }
        documentsList.forEach(async (documents) => {
            console.log(document)
            const response = await fetch("http://localhost:7000/share", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(
                    {
                        "id": userData.uId,
                        "doctorId": docData.doctorId,
                        "masterId": documents.filename.replace(".pdf", ''),
                        accessTime
                    }
                )
            });
            const data = await response.json()
            console.log(data)

        });
        dispatch(removeShareDocs());
        document.querySelector(".shareDocuments__popup").classList.remove("active");

    }
    return (
        <div className="shareDocuments">
            <h1>List of Documents to be shared</h1>
            {Object.keys(documentsList).map((key) => {
                return (<div key={key} className="shareDocuments__list">
                    <p>{documentsList[key].category}</p>
                    <p>{documentsList[key].date}</p>
                    <p>{documentsList[key].hospitalName}</p>
                    <TrashIcon className="shareDocuments__trashIcon"
                        onClick={() => {
                            dispatch(deleteShareDocs(documentsList[key]));
                            setdummy(!dummy)
                        }}
                    />
                </div>)
            })}
            <div className="shareDocuments__shareButton">
                <button
                    onClick={() => {
                        document.querySelector(".shareDocuments__popup").classList.toggle("active")
                    }}
                >Share</button>
            </div>
            <div className="shareDocuments__popup">
                <div className="shareDocuments__close"
                    onClick={() => {
                        document.querySelector(".shareDocuments__popup").classList.remove("active")
                    }}
                >
                    X
                </div>
                <h1>Share your documents</h1>
                <div className="shareDocuments__selectTime">
                    <div className="shareDocuments__Time">
                        <input ref={timeNumber} type="number" />
                        <select ref={timeUnit}>
                            <option value="day">day</option>
                            <option value="hr">hr</option>
                            <option value="min">min</option>
                        </select>
                    </div>

                    OR
                    <div className="shareDocuments__checkbox">
                        <input type="checkbox" onChange={() => { }} />
                        Live Share
                    </div>
                </div>
                <div className="shareDocuments__searchBar">
                    <input type="search"
                        onChange={(e) => {
                            if (e.target.value != '') {
                                let tempData = [];
                                Object.keys(doctorData).map((key) => {
                                    if (doctorData[key].name.includes(e.target.value)) {
                                        tempData = [...tempData, doctorData[key]];
                                    }
                                })
                                settemporaryData(tempData)
                            } else {
                                settemporaryData([]);
                            }
                        }}
                        placeholder="Input the name of the doctor" />
                </div>
                {console.log(documentsList)}
                <div className="shareDocuments__searchedData">
                    {Object.keys(temporaryData).map((key) => {
                        return (
                            <div key={key} className="shareDocuments__doctorInfo">
                                <div className="shareDocuments__imgBox">
                                    <img src={temporaryData[key].photo} alt="Doctor Photo" className="shareDocuments__doctorImage" />
                                </div>
                                <p>{temporaryData[key].name}</p>
                                <button
                                    onClick={(e) => shareData(temporaryData[key], e)}
                                >Share</button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default ShareDocuments
