import React, { useEffect } from 'react'
import HomeNav from './HomeNav'
import './HomePage.scss'
import SearchIcon from '@material-ui/icons/Search';
import Nischal from "./images/nischal.jpg"
import NotificationsIcon from '@material-ui/icons/Notifications';
import { userEmail } from './features/counterSlice';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
function HomePage() {
    const history=useHistory();
    const useremail = useSelector(userEmail);
    if(useremail===null){
        history.push("/")
    }
    useEffect(() => {
        async function getData(){
            const response=await fetch(`https://jsonplaceholder.typicode.com/users/1`,{
                method:"GET"
            });
            const data=await response.json();
            console.log(data);
        }
        return getData();
    }, []);
    return (
        <div className="homePage">
            <div className="homePage__anim">
            <div className="homePage__anim__card">
            </div>
        </div>
        <div className="homePage__content">
            <HomeNav />
            <div className="homePage__middlePart">
                <div className="homePage__middleTop">
                    <h1>Welcome Dr. Nischala Bhandari</h1>
                    <div className="homePage__searchBar">
                        <input type="search" placeholder="Search" list="search"/>
                        <button><SearchIcon /></button>
                        <datalist id="search">
                            <option value="Nabin">Nabin</option>
                            <option value="Nischal">Nischal</option>
                        </datalist>
                    </div>
                    <NotificationsIcon className="homePage__notifyIcon" />
            </div>
            <div className="homePage__middleContent">
                <h4>Recent Patients</h4>
                
            </div>
            </div>
                
            <div className="homePage__rightPart">
                <div className="homePage__profileCard">
                    <div className="homePage__profileCard__imgBox">
                        <img src={Nischal} alt="" /> {/* Doctor photo */}
                    </div>
                    <div className="homePage__profileCard__content">
                        <h4>Dr. Nischala Bhandari</h4> {/*Doctor name*/}
                    </div>
                    
                </div>

            </div>
            
        </div>
        </div>
        
    )
}

export default HomePage
