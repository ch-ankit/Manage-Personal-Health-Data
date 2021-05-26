import React, { useRef } from 'react'
import HomeDrawer from './HomeDrawer'
import HomeNav from './HomeNav'
import "./PatientDocument.scss"
import {SearchIcon} from '@heroicons/react/solid'
import { useHistory } from 'react-router'
function PatientDocuments() {
    const searchText = useRef(null);
    const category=useRef(null);
    const history=useHistory()
    return (
        <div className="patientDocument">
            <HomeNav />
            <div className="patientDocument__content">
                <HomeDrawer />
                <div className="patientDocument__documents">
                    <div className="patientDocument__searchBar">
                        <input ref={searchText} type="search" placeholder="Input the name of the documents" />
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
                    <div className="patienDocuments__details">
                        <table>
                            <tr>
                                <td>Id</td>
                                <td>Document</td>
                                <td>Created Date</td>
                                <td>Category</td>
                            </tr>

                            <tr onClick={()=>history.push('documentviewer')} >
                                <td>101345</td>
                                <td>Check up for stomach ache</td>
                                <td>2020-01-22</td>
                                <td>Stomach</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PatientDocuments
