import React, { useRef, useState } from 'react'
import {useSelector} from 'react-redux'
import "./PatientDocument.scss"
import {SearchIcon} from '@heroicons/react/solid'
import { useHistory } from 'react-router'
function PatientDocuments() {
    const [searchText,setsearchText] = useState('');
    const category=useRef(null);
    const history=useHistory();
    const userData = useSelector(state => state.user.value);
    const [searchedData,setSearchedData]=useState([]);
    const searchData=async()=>{
        const response=await fetch(`http://localhost:7000/search?patientId=${userData?.uId}`,{
            method:"GET"
        });
        const data=await response.json();
        setSearchedData(data);
        console.log(data);
    }
    return (
        <div className="patientDocument">
            <div className="patientDocument__content">
                <div className="patientDocument__documents">
                    <div className="patientDocument__searchBar">
                        <input type="search" onClick={(e)=>{
                            searchData();
                            setsearchText(e.target.value)
                        }} placeholder="Input the name of the documents" />
                        <input ref={category} type="text" placeholder="Category" list="category" />
                        <datalist id="category">
                            <option value="eyes">Eyes</option>
                            <option value="ears">Ears</option>
                            <option value="nose">Nose</option>
                            <option value="heart">Heart</option>
                            <option value="kidney">Kidney</option>
                            <option value="head">Head</option>
                            <option value="stomach">Stomach</option>
                            <option value="lungs">Lungs</option>
                        </datalist>
                        <SearchIcon className="searchIcon" />
                    </div>
                    <div className="patientDocuments__details">
                        <table>
                            <thead>
                                <tr>
                                    <td>Id</td>
                                    <td>Document</td>
                                    <td>Created Date</td>
                                    <td>Category</td>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(searchedData).map((key)=>{
                                    if(searchedData[key].filename.includes(searchText)){
                                        return(
                                            <tr onClick={()=>history.push('documentviewer')} >
                                                <td>{searchedData[key].date}</td>
                                                <td>{searchedData[key].filename}</td>
                                                <td>{searchedData[key].date}</td>
                                                <td>{searchedData[key].symptoms}</td>
                                            </tr>)
                                    }
                                    
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PatientDocuments
