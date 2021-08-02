import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import "./DocumentViewer.scss";
import { useDispatch, useSelector } from "react-redux";
import { reportGet } from "./features/counterSlice";

function DocumentViewer() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const documentName = useSelector(state => state.user.documentName)
  const patientData=useSelector(state => state.user.recentPatient);
  const userData = useSelector((state) => state.user.value);
  const [uploadData,setUploadData]=useState([])
  const history= useHistory();
  const dispatch=useDispatch()
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
{console.log(documentName)}

  useEffect(() => {
    async function getToUploadData(){
      console.log(documentName.replace('.pdf',''))
      const response=await fetch(`http://localhost:7000/report/toupload?id=${userData?.uId ?? patientData.value}&masterIdentifier=${documentName.replace('.pdf','')}`,{
        method:"GET"
      });
      const data=await response.json();
      
      console.log(data)
      setUploadData(data);
    }
    return getToUploadData();
  }, []);
  return (
    <div className="documentViewer">
      <Document
        file={`http://localhost:7000/record?recordName=${documentName}&patientId=${userData?.uId ?? patientData?.value}`}
        onLoadSuccess={onDocumentLoadSuccess}
        className="documentViewer__document"
      >
        {Array.apply(null, Array(numPages))
          .map((x, i) => i + 1)
          .map((page) => (
            <Page pageNumber={page} className="documentViewer__page" />
          ))}
      </Document>
        <div className="documentViewer__download">Share</div>

      <div className="documentViewer__reports">
        <ul>
          {Object.keys(uploadData).map((key)=>{
           return( 
           <li key={key} onClick={async()=>{
              const response=await fetch(`http://localhost:7000/report/checkreport?id=${userData?.uId ?? patientData?.value}&masterId=${documentName.replace('.pdf','')}&reportId=${uploadData[key].value}`,{
                method:"GET"
              })
              const data=await response.json();
              console.log(data);
              if(data.message==="report not available"){
                dispatch(reportGet(uploadData[key]));
                if(patientData){
                  alert("No report available");
                }
                else{
                  history.push("/home/uploadReport");
                }
              }else if(data.message==="report available"){
                dispatch(reportGet(uploadData[key]));
                if(patientData){
                  history.push("/Doctor/reportView")
                }
                else{
                  history.push("/home/reportView")
                }
              }
           }} key={key}>{uploadData[key].text}</li>
          )})}
        </ul>
      </div>
    </div>
  );
}
export default DocumentViewer;
