import React from 'react'

function Notification(props) {
    return (
        <div>
            <i className="fas fa-exclamation-circle"></i>
            <h2>{props.message}</h2>
        </div>
    )
}

export default Notification;