import React from 'react'
import {UserIcon} from "@heroicons/react/solid"
import "./HomeNav.scss"
function HomeNav() {
    //const state = useSelector();
    return (
        <div className="homeNav">
            <h1>MHPD</h1>  {/* title of the project */}
            <div className="homeNav__right">
                <UserIcon className="homeNav__icon" />
                <p>Anbu</p>   {/* display the userName */}
            </div>
        </div>
    )
}

export default HomeNav
