import React from 'react'
import { useHistory } from 'react-router'
import "./DocumentViewer.scss"
function DocumentViewer() {
    return (
        <div className="documentViewer">
            <object data="http://localhost:7000/report?id=2000-03-16456132&reportName=1622447862606-Interrupt%20Cycle.pdf"
                type="application/pdf" className="documentViewer__document"
            />
        </div>
    )
}

export default DocumentViewer
