import React, { useEffect } from 'react';

function FriendList(props) {
    useEffect(() => {
        async function getFriendList() {
            const response = await fetch()
        }
        return getFriendList()
    })
    return (
        <div style={{ backgroundColor: 'white', height: '100%', width: '100%' }}>

        </div>
    );
}

export default FriendList;