import React, { useRef } from 'react';
import { useSelector } from 'react-redux'
import './Report.scss'

function Report() {
    const form = useRef(null)
    const userData = useSelector(state => state.user.value)

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData(form.current);
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
                <form ref={form} onSubmit={handleUpload} encType="multipart/form-data">
                    <input value={userData?.id} name="id" style={{ display: 'none' }} />
                    <input type="file" name="file" multiple />
                    <button type="submit">Upload</button>
                </form>
            </div>
        </div>
    );
}

export default Report;