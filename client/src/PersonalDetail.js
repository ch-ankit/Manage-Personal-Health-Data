import React from 'react'
import "./PersonalDetail.scss"

function PersonalDetail() {
    return (
        <div className="personalDetail">
            <h2>Profile</h2>

            <div className="personalDetail__content">
                <h2>Profile Demographics</h2>
                <div className="personalDetail__detail">
                    <div className="personalDetail__who">
                        <h4>Who</h4>
                        <div className="personalDetail__who1">
                            <p>Ankit Khatiwada</p>              {/* display name of the user */}
                            <p>Sex : Male</p>                   {/* display sex of the user */}
                            <p>Martial Status: Single </p>      {/* display maarital status of the user */}
                        </div>
                        <div className="personalDetail__who2">
                            <p>DOB: 2000-01-01</p>              {/* display the DOB of the user */}
                        </div>
                    </div>
                    <div className="personalDetail__contact">
                        <h4>Contact</h4>
                        <div className="personalDetail__contact1">
                            <p>Address: GatthaGhar</p>          {/* display the address of the user */}
                            <p>Country: Nepal</p>               {/* display the country name */}
                        </div>
                        <div className="personalDetail__contact2">
                            <p>Zip Code: 44600</p>              {/* display the zip code */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PersonalDetail
