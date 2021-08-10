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
                        doctor?history.push("/doctor"):history.push("/home")
                    }}
                >Profile</li>
                {
                    !doctor &&
                    (<li onClick={() => {
                        document.querySelector(".homeDrawer").classList.remove("active")
                        history.push('/home/addDoc')
                    }}>
                        Add Doctor
                    </li>)
                }
                { !doctor &&<li
                    onClick={() => {
                        document.querySelector(".homeDrawer").classList.remove("active")
                        history.push("/home/lastVisited")
                    }}
                >Recent Documents</li>}
                {doctor ?
                    (<li onClick={() => {
                        document.querySelector(".homeDrawer").classList.remove("active")
                        history.push('/doctor/patients')
                    }}>
                        Patients
                    </li>) :
                    (<li onClick={() => {
                        document.querySelector(".homeDrawer").classList.remove("active")
                        history.push('/home/documents')
                    }}>My Documents</li>)
                }
                {!doctor && <li onClick={() => {
                    document.querySelector(".homeDrawer").classList.remove("active")
                    history.push('/home/shareDocuments')
                }}>To be Shared</li>}
                {!doctor &&
                 <li onClick={() => {
                    document.querySelector(".homeDrawer").classList.remove("active")
                    history.push('/home/sharedDocuments')
                }}>Shared Documents</li>}
                {!doctor && <li onClick={() => {
                    document.querySelector(".homeDrawer").classList.remove("active")
                    history.push('/home/uploadRecord')
                }}>Upload Records</li>}
                <li>
                <a
                    href="https://dokchat.herokuapp.com/"
                >Chat</a></li>
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
