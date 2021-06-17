import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import "./PersonalDetail.scss"
import { useHistory } from 'react-router-dom'
function PersonalDetail() {
    const userData = useSelector((state) => state.user.value);
    const darkMode = useSelector((state) => state.user.darkMode);
    const history = useHistory();
    const address = useRef(null)
    const contactInfo = useRef(null)
    const dob = useRef(null);
    const email = useRef(null)
    const emergencyContactName = useRef(null)
    const emergencyContactNo = useRef(null)
    const emergencyContactRltn = useRef(null)
    const gender = useRef(null)
    const occupation = useRef(null)
    const language = useRef(null)
    const maritalStatus = useRef(null)
    const name = useRef(null)
    const zipCode = useRef(null)

    if (userData == null) {
        history.push('/')
    }
    const handleChange = (e) => {
        e.preventDefault();
    }
    const handleSubmit = (e) => {
        e.preventDefault();
    }
    return (
        <div className="personalDetail">
            {console.log(darkMode)}
            <h2>Profile</h2>

            <div className="personalDetail__content">
                <div className="personalDetail__button">
                    <h2>Profile Demographics</h2>
                    <button onClick={() => {
                        document.querySelector('.personalDetail__popup').classList.toggle('active')
                    }}>Change</button>
                </div>
                <div className="personalDetail__detail">
                    <div className="personalDetail__who">
                        <h4>Who</h4>
                        <div className="personalDetail__who1">
                            <p>{userData?.firstName+ ' ' + userData.lastName}</p>              {/* display name of the user */}
                            <p>Sex : {userData?.gender}</p>                   {/* display sex of the user */}
                            <p>Martial Status: {userData?.maritalStatus} </p>      {/* display maarital status of the user */}
                        </div>
                        <div className="personalDetail__who2">
                            <p>DOB: {userData?.birthDate}</p>              {/* display the DOB of the user */}
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
            <div className="personalDetail__popup">
                <form id="personalDetailForm" onSubmit={handleSubmit}>
                    <h1>
                        <span>Change you personal Detail</span>
                        <span onClick={() => {
                            document.querySelector(".personalDetail__popup.active").classList.remove('active')
                        }} style={{ cursor: "pointer" }}>X</span>
                    </h1>
                    <label htmlFor="name">Name
                    <input ref={name} type="text" id="name" defaultValue={userData?.name} placeholder="Name" />
                    </label>

                    <label htmlFor="address">Address
                    <input ref={address} type="text" defaultValue={userData?.address} id="address" placeholder="Address" />
                    </label>

                    <label htmlFor="email">Email
                    <input ref={email} type="email" defaultValue={userData?.email} id="email" placeholder="Email" />
                    </label>

                    <label htmlFor="language">Language
                <input ref={language} type="text" defaultValue={userData?.language} id="language" placeholder="Language" />
                    </label>
                    <div className="personalDetail__radio">
                        <h5>Marital Status:</h5>
                        <label htmlFor="Married">
                            <input ref={maritalStatus} type="radio" defaultChecked={userData?.maritalStatus === "Married"} id="Married" value="Married" name="Marital Status" onClick={() => { maritalStatus.current.value = "Married" }} />
                        Married
                    </label>
                        <label htmlFor="Single">
                            <input ref={maritalStatus} type="radio" defaultChecked={userData?.maritalStatus === "Single"} id="Single" value="Single" name="Marital Status" onClick={() => { maritalStatus.current.value = "Single" }} />
                        Single
                    </label>
                    </div>
                    <label htmlFor="zipCode">Zip code
                <input ref={zipCode} type="text" defaultValue={userData?.zipCode} id="zipCode" placeholder="Zip-Code" />
                    </label>
                    <label htmlFor="dob">DOB
                <input ref={dob} type="date" defaultValue={userData?.dob} id="dob" placeholder="Date of Birth" />
                    </label>
                    <label htmlFor="contactInfo">ContactInfo
                <input ref={contactInfo} type="text" defaultValue={userData?.contactInfo} id="contactInfo" placeholder="Contact Number" />
                    </label>
                    <input type="file" accept="image/*" alt="Profile photo" onChange={handleChange} />
                    <img src={userData?.photo} style={{ height: '81px', width: '256px' }} className={`image ${darkMode && "imageDark"}`} alt="Uploaded" />
                    <label htmlFor="occupation">Occupation
                <input ref={occupation} type="text" defaultValue={userData?.occupation} placeholder="Occupation" />
                    </label>
                    <div className="personalDetail__select">
                        <h4>Gender</h4>
                        <div className="personalDetail__customSelect">
                            <select ref={gender} defaultValue={userData?.gender} id="gender" >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="personalDetail__emergency">
                        <h4>Emergency contact</h4>
                        <hr />
                        <div>
                            <label htmlFor="emergencyContactName">Name
                    <input ref={emergencyContactName} type="text" defaultValue={userData?.emergencyContactName} placeholder="Name" />
                            </label>
                            <label htmlFor="emergencyContactNo">Contact No
                    <input ref={emergencyContactNo} type="text" id="contactInfo" defaultValue={userData?.emergencyContactNo} placeholder="Contact info" />
                            </label>
                            <label htmlFor="emergencyContactRltn">Contact Relation
                    <input ref={emergencyContactRltn} type="text" defaultValue={userData?.emergencyContactRltn} placeholder="Relation" />
                            </label>
                        </div>
                    </div>
                    <button type="submit" form="personalDetailForm">Change</button>
                </form>
            </div>
        </div>
    )
}

export default PersonalDetail
