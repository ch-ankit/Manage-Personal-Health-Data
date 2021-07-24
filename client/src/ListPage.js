import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { documentGet } from './features/counterSlice';
import "./ListPage.scss"

function ListPage() {
    const [listData,setListData]=useState([]);
    const dispatch=useDispatch();
    const user=useSelector(state=>state.user.value);
    const history=useHistory();
    useEffect(()=>{
        async function getLatestData(){
            const response=await fetch(`http://localhost:7000/lastVisited?patientId=${user.uId}`,{
                method:"GET"
            })
            const data= await response.json()
            setListData(data);
            console.log(data)
        }
        return getLatestData()
    },[])
    return (
        <div className="listPage">
            {Object.keys(listData).map((key)=>{
                return(
                    <div key={key} className="listPage__list" onClick={()=>{
                        dispatch(documentGet(listData[key].filename));
                        history.push('documentviewer'
                        )}}>
                        <p>{listData[key].reportTitle}</p>
                        <p>{listData[key].hospitalName}</p>
                        <p>{listData[key].date}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default ListPage
