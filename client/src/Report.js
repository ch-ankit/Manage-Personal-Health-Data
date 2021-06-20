import React, { useState } from 'react';
import {useSelector} from 'react-redux'
import storage from './firebaseConfig';
import './Report.scss'

function Report() {
    const [pdfFile, setpdfFile] = useState(null);
    const userData = useSelector(state => state.user.value.data)
    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files[0]) {
            setpdfFile(e.target.files[0]);
        }
    }
    const handleUpload = async (e) => {
        e.preventDefault();
        // const uploadTask = storage.ref(`Documents/${pdfFile.name}`).put(pdfFile);
        // uploadTask.on(
        //     "state_changed",
        //     (snapshot) => {
        //     },
        //     (error) => {
        //         console.log(error);
        //         alert(error.message);
        //     },
        //     () => {
        //         storage
        //             .ref("Documents")
        //             .child(pdfFile.name)
        //             .getDownloadURL()
        //             .then(async (url) => {
        //                 console.log(url)
        //             })

        //     }
        // )
        const formData = new FormData();
        formData.append('id', userData.id) //in id userId must be sent
        formData.append('file', pdfFile) //'file' should be same because backend expects our pdf inside file
        console.log(formData)
        const response = await fetch('http://localhost:7000/report', {
            method: 'POST',
            body: formData
        })
        console.log(response)
    }
    return (
        <div className="report">
            <div className="report__upload">
                <h1>Upload your report</h1>
                <form onSubmit={handleUpload} encType="multipart/form-data">
                    <input onChange={handleChange} type="file" name="file" multiple/>
                    <button type="submit">Upload</button>
                </form>
            </div>
        </div>
    );
}

export default Report;