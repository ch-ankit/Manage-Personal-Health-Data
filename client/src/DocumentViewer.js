import React from 'react'
import { useHistory } from 'react-router'
import "./DocumentViewer.scss"
function DocumentViewer() {
    const history = useHistory()
    return (
        <div className="documentViewer">
            <embed src="http://localhost:7000/report?id=2000-03-16456132&reportName=1622447862606-Interrupt%20Cycle.pdf"
                className="documentViewer__document"
            />
        </div>
    )
}

export default DocumentViewer
