import React from 'react';

const IncomingCallNotification = ({ 
    incomingCall, 
    getChatPartner, 
    selectedChat, 
    onAcceptCall, 
    onRejectCall 
}) => {
    if (!incomingCall) return null;

    return (
        <div style={{
            padding: '10px',
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-bg)',
            borderRadius: 5,
            marginBottom: 10,
            textAlign: 'center'
        }}>
            <div>Incoming call from {getChatPartner(selectedChat)}</div>
            <div style={{ marginTop: 10 }}>
                <button
                    onClick={onAcceptCall}
                    style={{
                        padding: '5px 15px',
                        backgroundColor: 'green',
                        color: 'white',
                        border: 'none',
                        borderRadius: 5,
                        cursor: 'pointer',
                        marginRight: 10
                    }}
                >
                    Accept
                </button>
                <button
                    onClick={onRejectCall}
                    style={{
                        padding: '5px 15px',
                        backgroundColor: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: 5,
                        cursor: 'pointer'
                    }}
                >
                    Reject
                </button>
            </div>
        </div>
    );
};

export default IncomingCallNotification;