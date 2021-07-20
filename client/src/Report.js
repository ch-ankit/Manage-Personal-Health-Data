import React, { useRef } from "react";
import { useSelector } from "react-redux";
import "./Report.scss";

function Report() {
  const form = useRef(null);
  const userData = useSelector((state) => state.user.value);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData(form.current);
    const response = await fetch("http://localhost:7000/record", {
      method: "POST",
      body: formData,
    });
    console.log(response);
  };
  const handleMedicalUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData(form.current);
    const response = await fetch("http://localhost:7000/report", {
      method: "POST",
      body: formData,
    });
    console.log(response);
  };
  console.log(userData.uId);
  return (
    <div className="report">
      <div className="report__upload">
        <h1>Upload your report</h1>
        <form ref={form} onSubmit={handleUpload} encType="multipart/form-data">
          <input value={userData?.uId} name="id" style={{ display: "none" }} />
          <input type="file" name="file" multiple />
          <button type="submit">Upload</button>
        </form>
      </div>
      <div className="newreport__upload">
        <h1>Upload your Medical report</h1>
        <form ref={form} onSubmit={handleMedicalUpload} encType="multipart/form-data">
          <input value={20000101 - 794155} name="id" style={{ display: "none" }} />
          <input value={1626764008937} name="masterId" style={{ display: "none" }} />
          <input type="file" name="file" multiple />
          <button type="submit">Upload</button>
        </form>
      </div>
    </div>
  );
}

export default Report;
