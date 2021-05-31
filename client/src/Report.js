import React, { useState } from 'react';
import storage from './firebaseConfig';
import HomeDrawer from './HomeDrawer';
import HomeNav from './HomeNav';
import './Report.scss'

function Report() {
    const [pdfFile, setpdfFile] = useState(null);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files[0]) {
            setpdfFile(e.target.files[0]);
        }
    }
    const handleUpload = async (e) => {
        e.preventDefault();
        const uploadTask = storage.ref(`Documents/${pdfFile.name}`).put(pdfFile);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                    .ref("Documents")
                    .child(pdfFile.name)
                    .getDownloadURL()
                    .then(async (url) => {
                        console.log(url)
                    })

            }
        )

    }
    return (
        <div className="report">
            <HomeNav />
            <HomeDrawer />
            <div className="report__upload">
                <form onSubmit={handleUpload}>
                    <input type="text" placeholder="Document Name" />
                    <input type="text" placeholder="Category" />
                    <input onChange={handleChange} type="file" />
                    <button type="submit">Upload</button>
                </form>
            </div>
        </div>
    );
}

export default Report;