import React from 'react'
import { useSelector } from 'react-redux'
import "./PersonalDetail.scss"
import {useHistory} from 'react-router-dom'
function PersonalDetail() {
    const userData = useSelector((state)=>state.user.value.data);
    const history=useHistory();
    if(userData == null){
        history.push('/')
    }
    return (
        <div className="personalDetail">
            <h2>Profile</h2>

            <div className="personalDetail__content">
                <h2>Profile Demographics</h2>
                <div className="personalDetail__detail">
                    <div className="personalDetail__who">
                        <h4>Who</h4>
                        <div className="personalDetail__who1">
                            <p>{userData?.name}</p>              {/* display name of the user */}
                            <p>Sex : {userData?.gender}</p>                   {/* display sex of the user */}
                            <p>Martial Status: {userData?.maritalStatus} </p>      {/* display maarital status of the user */}
                        </div>
                        <div className="personalDetail__who2">
                            <p>DOB: {userData?.dob}</p>              {/* display the DOB of the user */}
                        </div>
                    </div>
                    <div className="personalDetail__contact">
                        <h4>Contact</h4>
                        <div className="personalDetail__contact1">
                            <p>Address: {userData?.address}</p>          {/* display the address of the user */}
                            <p>Country: Nepal</p>               {/* display the country name */}
                            <p>Emergency Contact: {userData?.emergencyContactName}</p>   {/* dsplay emergency contact name */}
                            <p>Home Phone:12343445</p>          {/* display home phone number of user */}
                            <p>Mobile Phone: {userData?.emergencyContactNo}</p>     {/* display mobile number of user */}
                        </div>
                        <div className="personalDetail__contact2">
                            <p>Zip Code: {userData?.zipCode}</p>              {/* display the zip code */}
                            <p>Mother's Name:Mother</p>         {/* display mother's name */}
                            <p>Emergency Phone: 9861444780</p>  {/* display emergency phone number */}
                            <p>Email: {userData?.email}</p>   {/* display user email */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PersonalDetail
