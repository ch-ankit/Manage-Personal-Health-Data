import React from 'react'
import { useHistory } from 'react-router';
import "./HomeDrawer.scss"
import { darkmode, logoutUser, logoutDoctor } from './features/counterSlice'
import { useDispatch, useSelector } from 'react-redux';
function HomeDrawer(props) {
    const darkMode = useSelector(state => state.user.darkMode)
    const { doctor } = props
    const dispatch = useDispatch()
    const history = useHistory();
    return (
        <div className="homeDrawer">
            <ul>
                <li
                    onClick={() => {
                        document.querySelector(".homeDrawer").classList.remove("active")
                        history.push("/home")
                    }}
                >Profile</li>
                <li
                    onClick={()=>{
                        document.querySelector(".homeDrawer").classList.remove("active")
                        history.push("/home/lastVisited")
                    }}
                >Recent Documents</li>
                {doctor ?
                    (<li onClick={() => {
                        document.querySelector(".homeDrawer").classList.remove("active")
                        history.push('/doc/patients')
                    }}>
                        Patients
                    </li>) :
                    (<li onClick={() => {
                        document.querySelector(".homeDrawer").classList.remove("active")
                        history.push('/home/documents')
                    }}>Patient Documents</li>)
                }

                <li onClick={() => {
                    document.querySelector(".homeDrawer").classList.remove("active")
                    history.push('/home/uploadRecord')
                }}>Upload Records</li>
                <li onClick={() => {
                    dispatch(logoutUser())
                    dispatch(logoutDoctor())
                    darkMode && dispatch(darkmode())
                    history.push('/')
                }}>Logout</li>
            </ul>
            <div className="homeDrawer__button"
                onClick={() => {
                    document.querySelector(".homeDrawer").classList.toggle("active");
                }}
            >
                <h1>|||</h1>
            </div>
        </div>
    )
}

export default HomeDrawer
