import React, { useEffect, useRef, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import "./PatientDocument.scss"
import {SearchIcon} from '@heroicons/react/solid'
import { useHistory } from 'react-router'
import { documentGet, shareDocs } from './features/counterSlice'
import {ShareIcon} from "@heroicons/react/solid"
function PatientDocuments() {
    const [searchText,setSearchText] = useState('');
    const [category, setCategory]=useState('')
    const history=useHistory();
    const userData = useSelector(state => state.user.value);
    const [searchedData,setSearchedData]=useState([]);
    let [temporaryData, settemporaryData] = useState([]);
    const [reportDate2,setReportDate2]=useState('');
    const [reportDate1, setReportDate1] = useState('');
    const dispatch = useDispatch();
    let [temporaryStatus, settemporaryStatus] = useState(false);
    const record=useRef('');
    const bodySite=useRef('');
    const symptoms=useRef('');
    const date1=useRef('');
    const date2=useRef('');
    const Category=useRef('')

   

    const [dummy,setDummy]=useState(false);
    useEffect(()=>{
        async function searchData(){
        const response=await fetch(`http://localhost:7000/search?patientId=${userData?.uId}`,{
            method:"GET"
        });
        const data=await response.json();
        setSearchedData(data);
        console.log(data);
    }
        return searchData();
    },[]);
    function search(){
        console.log(record.current.value,bodySite.current.value,symptoms.current.value,Category.current.value)
        if(record.current.value != '' && bodySite.current.value !='' && symptoms.current.value !=''
            && date1.current.value !='' && date2.current.value !='' && Category.current.value !='Select any one'){
                let temp=[]
                Object.keys(searchedData).map((key)=>{
                    if((parseInt(searchedData[key].date.split('-').join(''))>= parseInt(date1.current.value.split('-').join(''))) 
                    && (parseInt(searchedData[key].date.split('-').join(''))<= parseInt(date2.current.value.split('-').join(''))) 
                    && searchedData[key].reportTitle.toUpperCase().includes(record.current.value.toUpperCase()) && searchedData[key].category.toUpperCase().includes(Category.current.value.toUpperCase()) && searchedData[key].bodyPart.toUpperCase().includes(bodySite.current.value.toUpperCase()) && searchedData[key].symptoms.toUpperCase().includes(symptoms.current.value.toUpperCase())){
                        temp.push(searchedData[key]);
                    }
                    console.log(temp);
                    settemporaryData(temp)
                })
            }
            else if(record.current.value != '' && bodySite.current.value !='' && symptoms.current.value !=''
             && Category.current.value !='Select any one'){
                let temp=[]
                Object.keys(searchedData).map((key)=>{
                    if(searchedData[key].reportTitle.toUpperCase().includes(record.current.value.toUpperCase()) && searchedData[key].category.toUpperCase().includes(Category.current.value.toUpperCase()) && searchedData[key].bodyPart.toUpperCase().includes(bodySite.current.value.toUpperCase()) && searchedData[key].symptoms.toUpperCase().includes(symptoms.current.value.toUpperCase())){
                        temp.push(searchedData[key]);
                    }
                    console.log(temp);
                    settemporaryData(temp)
                })
             }
            else if(record.current.value != '' && bodySite.current.value !=''
                && date1.current.value !='' && date2.current.value !=''){
                    console.log(record.current.value != '' && bodySite.current.value !=''
                        && date1.current.value !='' && date2.current.value !='')
                    let temp=[]
                Object.keys(searchedData).map((key)=>{
                    if((parseInt(searchedData[key].date.split('-').join(''))>= parseInt(date1.current.value.split('-').join(''))) 
                    && (parseInt(searchedData[key].date.split('-').join(''))<= parseInt(date2.current.value.split('-').join(''))) 
                    && searchedData[key].reportTitle.toUpperCase().includes(record.current.value.toUpperCase()) && searchedData[key].bodyPart.toUpperCase().includes(bodySite.current.value.toUpperCase())){
                        temp.push(searchedData[key]);
                    }
                    console.log(temp);
                    settemporaryData(temp)
                })
                }
            else if(record.current.value != '' && symptoms.current.value !=''
                    && date1.current.value !='' && date2.current.value !=''){
                        let temp=[]
                        Object.keys(searchedData).map((key)=>{
                            if((parseInt(searchedData[key].date.split('-').join(''))>= parseInt(date1.current.value.split('-').join(''))) 
                            && (parseInt(searchedData[key].date.split('-').join(''))<= parseInt(date2.current.value.split('-').join(''))) 
                            && searchedData[key].reportTitle.toUpperCase().includes(record.current.value.toUpperCase()) && searchedData[key].symptoms.toUpperCase().includes(symptoms.current.value.toUpperCase())){
                                temp.push(searchedData[key]);
                            }
                            console.log(temp);
                            settemporaryData(temp)
                        })
                    }
            else if(record.current.value != '' && date1.current.value !='' && date2.current.value !='' && Category.current.value !='Select any one')
            {
                let temp=[]
                Object.keys(searchedData).map((key)=>{
                    if((parseInt(searchedData[key].date.split('-').join(''))>= parseInt(date1.current.value.split('-').join(''))) 
                    && (parseInt(searchedData[key].date.split('-').join(''))<= parseInt(date2.current.value.split('-').join(''))) 
                    && searchedData[key].reportTitle.toUpperCase().includes(record.current.value.toUpperCase()) && searchedData[key].category.toUpperCase().includes(Category.current.value.toUpperCase())){
                        temp.push(searchedData[key]);
                    }
                    console.log(temp);
                    settemporaryData(temp)
                })
            }
            else if( bodySite.current.value !='' && symptoms.current.value !=''
                && date1.current.value !='' && date2.current.value !='')
            {
                let temp=[]
                Object.keys(searchedData).map((key)=>{
                    if((parseInt(searchedData[key].date.split('-').join(''))>= parseInt(date1.current.value.split('-').join(''))) 
                    && (parseInt(searchedData[key].date.split('-').join(''))<= parseInt(date2.current.value.split('-').join(''))) 
                    && searchedData[key].bodyPart.toUpperCase().includes(bodySite.current.value.toUpperCase()) && searchedData[key].symptoms.toUpperCase().includes(symptoms.current.value.toUpperCase())){
                        temp.push(searchedData[key]);
                    }
                    console.log(temp);
                    settemporaryData(temp)
                })
            }
            else if( bodySite.current.value !='' && date1.current.value !='' && date2.current.value !='' && Category.current.value !='Select any one')
            {
                let temp=[]
                Object.keys(searchedData).map((key)=>{
                    if((parseInt(searchedData[key].date.split('-').join(''))>= parseInt(date1.current.value.split('-').join(''))) 
                    && (parseInt(searchedData[key].date.split('-').join(''))<= parseInt(date2.current.value.split('-').join(''))) 
                    && searchedData[key].category.toUpperCase().includes(Category.current.value.toUpperCase()) && searchedData[key].bodyPart.toUpperCase().includes(bodySite.current.value.toUpperCase())){
                        temp.push(searchedData[key]);
                    }
                    console.log(temp);
                    settemporaryData(temp)
                })
            }
            else if(symptoms.current.value !='' && date1.current.value !='' && date2.current.value !='' && Category.current.value !='Select any one')
            {
                let temp=[]
                Object.keys(searchedData).map((key)=>{
                    if((parseInt(searchedData[key].date.split('-').join(''))>= parseInt(date1.current.value.split('-').join(''))) 
                    && (parseInt(searchedData[key].date.split('-').join(''))<= parseInt(date2.current.value.split('-').join(''))) 
                    && searchedData[key].category.toUpperCase().includes(Category.current.value.toUpperCase()) && searchedData[key].symptoms.toUpperCase().includes(symptoms.current.value.toUpperCase())){
                        temp.push(searchedData[key]);
                    }
                    console.log(temp);
                    settemporaryData(temp)
                })
            }
            else if(record.current.value != '' && bodySite.current.value !='' && symptoms.current.value !=''){
                let temp=[]
                Object.keys(searchedData).map((key)=>{
                    if( searchedData[key].reportTitle.toUpperCase().includes(record.current.value.toUpperCase()) 
                    && searchedData[key].bodyPart.toUpperCase().includes(bodySite.current.value.toUpperCase()) && searchedData[key].symptoms.toUpperCase().includes(symptoms.current.value.toUpperCase())){
                        temp.push(searchedData[key]);
                    }
                    console.log(temp);
                    settemporaryData(temp)
                })
                }
            else if(record.current.value != '' && symptoms.current.value !='' && Category.current.value !='Select any one'){
                let temp=[]
                Object.keys(searchedData).map((key)=>{
                    if(searchedData[key].reportTitle.toUpperCase().includes(record.current.value.toUpperCase()) && searchedData[key].category.toUpperCase().includes(Category.current.value.toUpperCase()) && searchedData[key].symptoms.toUpperCase().includes(symptoms.current.value.toUpperCase())){
                        temp.push(searchedData[key]);
                    }
                    console.log(temp);
                    settemporaryData(temp)
                })
            }
            else if( bodySite.current.value !='' && symptoms.current.value !='' && Category.current.value !='Select any one'){
                let temp=[]
                Object.keys(searchedData).map((key)=>{
                    if(searchedData[key].category.toUpperCase().includes(Category.current.value.toUpperCase()) && searchedData[key].bodyPart.toUpperCase().includes(bodySite.current.value.toUpperCase()) && searchedData[key].symptoms.toUpperCase().includes(symptoms.current.value.toUpperCase())){
                        temp.push(searchedData[key]);
                    }
                    console.log(temp);
                    settemporaryData(temp)
                })
            }
            else if(record.current.value != '' && bodySite.current.value !='' && Category.current.value !='Select any one'){
                let temp=[]
                Object.keys(searchedData).map((key)=>{
                    if(searchedData[key].reportTitle.toUpperCase().includes(record.current.value.toUpperCase()) && searchedData[key].category.toUpperCase().includes(Category.current.value.toUpperCase()) && searchedData[key].bodyPart.toUpperCase().includes(bodySite.current.value.toUpperCase())){
                        temp.push(searchedData[key]);
                    }
                    console.log(temp);
                    settemporaryData(temp)
                })
            }
            else if(record.current.value != '' && date1.current.value !='' && date2.current.value !=''){
                let temp=[]
                Object.keys(searchedData).map((key)=>{
                    if((parseInt(searchedData[key].date.split('-').join(''))>= parseInt(date1.current.value.split('-').join(''))) 
                    && (parseInt(searchedData[key].date.split('-').join(''))<= parseInt(date2.current.value.split('-').join(''))) 
                    && searchedData[key].reportTitle.toUpperCase().includes(record.current.value.toUpperCase()) ){
                        temp.push(searchedData[key]);
                    }
                    console.log(temp);
                    settemporaryData(temp)
                })
            }
            else if( bodySite.current.value !='' && date1.current.value !='' && date2.current.value !=''){
                let temp=[]
                Object.keys(searchedData).map((key)=>{
                    if((parseInt(searchedData[key].date.split('-').join(''))>= parseInt(date1.current.value.split('-').join(''))) 
                    && (parseInt(searchedData[key].date.split('-').join(''))<= parseInt(date2.current.value.split('-').join(''))) 
                    && searchedData[key].bodyPart.toUpperCase().includes(bodySite.current.value.toUpperCase())){
                        temp.push(searchedData[key]);
                    }
                    console.log(temp);
                    settemporaryData(temp)
                })
            }
            else if(symptoms.current.value !='' && date1.current.value !='' && date2.current.value !='' ){
                let temp=[]
                Object.keys(searchedData).map((key)=>{
                    if((parseInt(searchedData[key].date.split('-').join(''))>= parseInt(date1.current.value.split('-').join(''))) 
                    && (parseInt(searchedData[key].date.split('-').join(''))<= parseInt(date2.current.value.split('-').join(''))) 
                    && searchedData[key].symptoms.toUpperCase().includes(symptoms.current.value.toUpperCase())){
                        temp.push(searchedData[key]);
                    }
                    console.log(temp);
                    settemporaryData(temp)
                })
            }
            else if( date1.current.value !='' && date2.current.value !='' && Category.current.value !='Select any one'){
                let temp=[]
                Object.keys(searchedData).map((key)=>{
                    if((parseInt(searchedData[key].date.split('-').join(''))>= parseInt(date1.current.value.split('-').join(''))) 
                    && (parseInt(searchedData[key].date.split('-').join(''))<= parseInt(date2.current.value.split('-').join(''))) 
                    && searchedData[key].category.toUpperCase().includes(Category.current.value.toUpperCase())){
                        temp.push(searchedData[key]);
                    }
                    console.log(temp);
                    settemporaryData(temp)
                })
            }
            else if(record.current.value != '' && bodySite.current.value !='')
            {
                let temp=[]
                Object.keys(searchedData).map((key)=>{
                    if(searchedData[key].reportTitle.toUpperCase().includes(record.current.value.toUpperCase()) && searchedData[key].bodyPart.toUpperCase().includes(bodySite.current.value.toUpperCase())){
                        temp.push(searchedData[key]);
                    }
                    console.log(temp);
                    settemporaryData(temp)
                })
            }
            else if(record.current.value != '' && symptoms.current.value !='')
            {
                let temp=[]
                Object.keys(searchedData).map((key)=>{
                    if(searchedData[key].reportTitle.toUpperCase().includes(record.current.value.toUpperCase()) && searchedData[key].symptoms.toUpperCase().includes(symptoms.current.value.toUpperCase())){
                        temp.push(searchedData[key]);
                    }
                    console.log(temp);
                    settemporaryData(temp)
                })
            }
            else if(record.current.value != '' && Category.current.value !='Select any one')
            {
                let temp=[]
                Object.keys(searchedData).map((key)=>{
                    console.log(searchedData[key].reportTitle.toUpperCase() ,searchedData[key].category.toUpperCase())
                    console.log()
                    if(searchedData[key].reportTitle.toUpperCase().includes(record.current.value.toUpperCase()) && searchedData[key].category.toUpperCase().includes(Category.current.value.toUpperCase())){
                        temp.push(searchedData[key]);
                    }
                    console.log(temp);
                    settemporaryData(temp)
                })
            }
            else if(bodySite.current.value !='' && symptoms.current.value !='')
            {
                let temp=[]
                Object.keys(searchedData).map((key)=>{
                    console.log(bodySite.current.value,symptoms.current.value)
                    console.log(searchedData[key].bodyPart.toUpperCase().includes(),searchedData[key].symptoms.toUpperCase())
                    if(searchedData[key].bodyPart.toUpperCase().includes(bodySite.current.value.toUpperCase()) && searchedData[key].symptoms.toUpperCase().includes(symptoms.current.value.toUpperCase())){
                        temp.push(searchedData[key]);
                        console.log("helo")
                    }
                    console.log(temp);
                    settemporaryData(temp)
                })
            }
            else if(bodySite.current.value !='' &&  Category.current.value !='Select any one')
            {
                let temp=[]
                Object.keys(searchedData).map((key)=>{
                    if(searchedData[key].category.toUpperCase().includes(Category.current.value.toUpperCase()) && searchedData[key].bodyPart.toUpperCase().includes(bodySite.current.value.toUpperCase())){
                        temp.push(searchedData[key]);
                    }
                    console.log(temp);
                    settemporaryData(temp)
                })
            }
            else if(symptoms.current.value !='' && Category.current.value !='Select any one')
            {
                let temp=[]
                Object.keys(searchedData).map((key)=>{
                    if(searchedData[key].category.toUpperCase().includes(Category.current.value.toUpperCase())  && searchedData[key].symptoms.toUpperCase().includes(symptoms.current.value.toUpperCase())){
                        temp.push(searchedData[key]);
                    }
                    console.log(temp);
                    settemporaryData(temp)
                })
            }
            else if (date1.current.value !='' && date2.current.value !='')
            {
                let temp=[]
                Object.keys(searchedData).map((key)=>{
                    if((parseInt(searchedData[key].date.split('-').join(''))>= parseInt(date1.current.value.split('-').join(''))) 
                    && (parseInt(searchedData[key].date.split('-').join(''))<= parseInt(date2.current.value.split('-').join(''))) 
                    ){
                        temp.push(searchedData[key]);
                    }
                    console.log(temp);
                    settemporaryData(temp)
                })            
            }
            else if(record.current.value !=''){
                let temp=[]
                Object.keys(searchedData).map((key)=>{
                    if(searchedData[key].reportTitle.toUpperCase().includes(record.current.value.toUpperCase())){
                        temp.push(searchedData[key]);
                    }
                    console.log(temp);
                    settemporaryData(temp)
                })
            }
            else if(bodySite.current.vaue !=''){
                let temp=[]
                Object.keys(searchedData).map((key)=>{
                    if(searchedData[key].bodyPart.toUpperCase().includes(bodySite.current.value.toUpperCase())){
                        temp.push(searchedData[key]);
                    }
                    console.log(temp);
                    settemporaryData(temp)
                })
            }
            else if(symptoms.current.value !=''){
                let temp=[]
                Object.keys(searchedData).map((key)=>{
                    if(searchedData[key].symptoms.toUpperCase().includes(symptoms.current.value.toUpperCase())){
                        temp.push(searchedData[key]);
                    }
                    console.log(temp);
                    settemporaryData(temp)
                })
            }
            else if(Category.current.value !='Select any one'){
                let temp=[]
                Object.keys(searchedData).map((key)=>{
                    if(searchedData[key].category.toUpperCase().includes(Category.current.value.toUpperCase())){
                        temp.push(searchedData[key]);
                    }
                    console.log(temp);
                    settemporaryData(temp)
                })
            }
            else{

            }
    }
    return (
        <div className="patientDocument">
            <div className="patientDocument__alert">
                <h3>Files added to the sharing list</h3>
                <div>
                    <button
                    onClick={()=>{
                        history.push("/home/shareDocuments")
                    }}
                    >Share Documents</button>
                    <button
                    onClick={()=>{
                        document.querySelector(".patientDocument__alert").classList.remove('active')
                    }}
                    >Ok</button>
                </div>
            </div>
            {console.log(temporaryData)}
            <div className="patientDocument__content">
                <div className="patientDocument__documents">
                    <h2 style={{marginTop:"1em"}}>Search by</h2>
                    <div className="patientDocument__searchBar">
                        <label>Record
                        <input ref={record} type="search"  placeholder="Record Type" />
                        </label>
                        <label>Body site
                        <input ref={bodySite} type="text" placeholder="Body Site"/>
                        </label>
                        <label>Symptoms
                        <input ref={symptoms}  type="text" placeholder="Symptoms"/>
                        </label>
                        <label>Start Date
                        <input type="date" ref={date1} className="startDate" 
                         />
                        </label>
                        <label>End Date
                         <input type="date" ref={date2} />
                        </label>
                        <label>Category
                        <select ref={Category} defaultValue="" >
                            <option selected="selected" hidden>Select any one</option>
                            <option value="Health and Respirotary">Health and Respirotary</option>
                            <option value="Psychiatry procedure or service">Psychiatry procedure or service</option>
                            <option value="Counselling">Counsellinsg</option>
                            <option value="Education">Education</option>
                            <option value="Surgical procedure">Surgical procedure</option>
                            <option value="Diagnostic procedure">Diagnostic procedure</option>
                            <option value="Chiropractic manipulation">Chiropractic manipulation</option>
                            <option value="Social service procedure">Social service procedure</option>
                        </select>
                        </label>
                        <button onClick={()=>{search()}}>Search</button>
                    </div>
                    <div className="patientDocuments__details">
                        <table>
                            <thead>
                                <tr>
                                    <td>Record Type</td>
                                    <td>Created Date</td>
                                    <td>Symptoms</td>
                                    <td>Category</td>
                                    <td>Hospital</td>
                                    <td className="patientDocuments__headShareIcon"
                                            onClick={()=>{
                                                console.log(temporaryData)
                                                dispatch(shareDocs(temporaryData));
                                                document.querySelector('.patientDocument__alert').classList.toggle("active");
                                            }}
                                            ><ShareIcon className="shareIcon" /> </td>
                                </tr>
                            </thead>
                            <tbody>
                            {console.log(temporaryData)}
                                {Object.keys(temporaryData).map((key)=>{
                                     return(
                                        <tr className="patientDocuments__dataList" key={key}  >
                                            <td onClick={()=>{
                                            dispatch(documentGet(temporaryData[key]));
                                            history.push('documentviewer'
                                            )}}>{temporaryData[key].reportTitle}</td>
                                            <td onClick={()=>{
                                            dispatch(documentGet(temporaryData[key]));
                                            history.push('documentviewer'
                                            )}}>{temporaryData[key].date}</td>
                                            <td onClick={()=>{
                                            dispatch(documentGet(temporaryData[key]));
                                            history.push('documentviewer'
                                            )}}>{temporaryData[key].symptoms}</td>
                                            <td onClick={()=>{
                                            dispatch(documentGet(temporaryData[key]));
                                            history.push('documentviewer'
                                            )}}>{temporaryData[key].category}</td>
                                            <td onClick={()=>{
                                            dispatch(documentGet(temporaryData[key]));
                                            history.push('documentviewer'
                                            )}}>{temporaryData[key].hospitalName}</td>
                                            <td className="patientDocuments__shareIcon"
                                            onClick={()=>{
                                                dispatch(shareDocs(temporaryData[key]));
                                                document.querySelector('.patientDocument__alert').classList.toggle("active");
                                            }}
                                            ><ShareIcon className="shareIcon" /> </td>
                                        </tr>
                                    
                                        )
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
