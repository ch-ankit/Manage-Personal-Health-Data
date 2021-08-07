import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import "./ReportView.scss"
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
function ReportView() {
    const report = useSelector(state => state.user.report);
    const patientData = useSelector(state => state.user.recentPatient);
    const userData = useSelector(state => state.user.value);
    const patientUidFromDocNots = useSelector(state => state.user.patientDataForNotification)
    const [numPages, setNumPages] = useState(null);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }
    return (
        <div className="reportView">
            {console.log(report.value)}
            <Document
                file={`http://localhost:7000/report?masterId=${report.filename}&id=${userData?.uId ?? patientData?.value ?? patientUidFromDocNots}&reportName=${report.value}.pdf`}
                onLoadSuccess={onDocumentLoadSuccess}
                className="reportView__document"
            >
                {Array.apply(null, Array(numPages))
                    .map((x, i) => i + 1)
                    .map((page) => (
                        <Page pageNumber={page} className="reportView__page" />
                    ))}
            </Document>
        </div>
    )
}

export default ReportView
