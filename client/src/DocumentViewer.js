import React, { useState } from "react";
import { useHistory } from "react-router";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import "./DocumentViewer.scss";
import { useSelector } from "react-redux";

function DocumentViewer() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const documentName = useSelector(state => state.user.documentName)
  const userData = useSelector((state) => state.user.value);
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
{console.log(documentName)}
  return (
    <div className="documentViewer">
      <Document
        file={`http://localhost:7000/record?recordName=${documentName}&patientId=${userData.uId}`}
        onLoadSuccess={onDocumentLoadSuccess}
        className="documentViewer__document"
      >
        {Array.apply(null, Array(numPages))
          .map((x, i) => i + 1)
          .map((page) => (
            <Page pageNumber={page} className="documentViewer__page" />
          ))}
      </Document>
      <a href="http://localhost:7000/report?id=2000-03-16456132&reportName=1622447862606-Interrupt%20Cycle.pdf" download>
        <div className="documentViewer__download">Download</div>
      </a>
    </div>
  );
}
export default DocumentViewer;
