import React, { useEffect } from 'react';

function SignUpDoc(props) {
    useEffect(() => {
        //test to get verified doc from nmc but returned html
        async function getDoc() {
            const response = await fetch('https://www.nmc.org.np/searchPractitioner?name=Dr.+Kartikesh+Kumar+Thakur&nmc_no=729&degree=MBBS', {
                method: 'GET',
                mode: 'no-cors'
            })
            console.log(response)
        }
        getDoc();
    })
    return (
        <div>

        </div>
    );
}

export default SignUpDoc;