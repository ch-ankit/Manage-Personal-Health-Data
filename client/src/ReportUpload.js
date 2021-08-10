import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { reportGet } from "./features/counterSlice";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import "./ReportUpload.scss";

function ReportUpload() {
  const form = useRef(null);
  const [file, setFile] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const userData = useSelector((state) => state.user.value);
  const documentName = useSelector(state => state.user.documentName)
  const report = useSelector(state => state.user.report);
  console.log(documentName, report.value)
  const handleMedicalUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData(form.current);
    const response = await fetch("http://localhost:7000/report", {
      method: "POST",
      body: formData,
    });
    console.log(response);
    alert(response)
    if(response.status==200){
      history.push("/home/lastVisited")
    }
  };
  console.log(userData.uId);
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  return (
    <div className="reportUpload">
      <div className="reportUpload__upload">
        <h1>Upload your report</h1>
        <form ref={form} onSubmit={handleMedicalUpload} encType="multipart/form-data">
          <input value={userData?.uId} name="id" style={{ display: "none" }} />
          <input value={documentName.filename.replace(".pdf","")} name="masterId" style={{ display: "none" }} />
          <input value={report.value} name="reportId" style={{ display: "none" }} />
          <input type="file" name="file" onChange={(e) => setFile(e.target.files)} multiple />
          <button type="submit">Upload</button>
        </form>
        <Document
          file={file[0]}
          onLoadSuccess={onDocumentLoadSuccess}
          className="reportUpload__document"
        >
          {Array.apply(null, Array(numPages))
            .map((x, i) => i + 1)
            .map((page) => (
              <Page pageNumber={page} className="reportUpload__page" />
            ))}
        </Document>
      </div>
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

export default ReportUpload;
