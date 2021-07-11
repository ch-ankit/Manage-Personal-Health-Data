import React, { useState } from "react";
import { useHistory } from "react-router";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import "./DocumentViewer.scss";

function DocumentViewer() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="documentViewer">
      <Document
        file="http://localhost:7000/record?recordName=Observation_Report.pdf&patientId=20000101-687825"
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
