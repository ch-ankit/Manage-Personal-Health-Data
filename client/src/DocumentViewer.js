import React from 'react'
import "./DocumentViewer.scss"
function DocumentViewer() {
    return (
        <div className="documentViewer">
            <embed src="https://firebasestorage.googleapis.com/v0/b/mhpd-652a9.appspot.com/o/Documents%2FCh8.pdf?alt=media&token=59f4cea4-dde7-448c-8406-a1044813be0b" 
                className="documentViewer__document"
            />
        </div>
    )
}

export default DocumentViewer
