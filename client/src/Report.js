import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import "./Report.scss";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import { useHistory } from "react-router-dom";

function Report() {
  const [numPages, setNumPages] = useState(null);
  const form = useRef(null);
  const userData = useSelector((state) => state.user.value);
  const [file,setFile]=useState([]);
  const history=useHistory()

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData(form.current);
    const response = await fetch("http://localhost:7000/record", {
      method: "POST",
      body: formData,
    });
    console.log(response);
    const data=await response.json();
    console.log(data)
    alert(data.message)
    if(response.status==200){
      history.push("/home/lastVisited")
    }
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
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  return (
    <div className="report">
      <div className="report__upload">
        <h1>Upload your record</h1>
        <form ref={form} onSubmit={handleUpload} encType="multipart/form-data">
          <input value={userData?.uId} name="id" style={{ display: "none" }} />
          <input type="file" onChange={(e)=>setFile(e.target.files)} name="file" multiple />
          <button type="submit">Upload</button>
        </form>
      </div>
      <Document
        file={file[0]}
        onLoadSuccess={onDocumentLoadSuccess}
        className="report__document"
      >
        {Array.apply(null, Array(numPages))
          .map((x, i) => i + 1)
          .map((page) => (
            <Page pageNumber={page} className="report__page" />
          ))}
      </Document>
      {/* <div className="newreport__upload">
        <h1>Upload your Medical report</h1>
        <form
          ref={form}
          onSubmit={handleMedicalUpload}
          encType="multipart/form-data"
        >
          <input
            value={"20000101-794155"}
            name="id"
            style={{ display: "none" }}
          />
          <input
            value={"1626764008937"}
            name="masterId"
            style={{ display: "none" }}
          />
          <input value={"104"} name="reportId" style={{ display: "none" }} />
          <input type="file" name="file" multiple />
          <button type="submit">Upload</button>
        </form>
      </div> */}
    </div>
  );
}

export default Report;
