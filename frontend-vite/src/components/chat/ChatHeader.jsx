import React from 'react';
import { isGlobalChat } from './ChatWidgetUtils';

const ChatHeader = ({ 
    selectedChat, 
    user, 
    callState, 
    onStartCall, 
    onCancelCall, 
    onHangUp, 
    getChatPartner 
}) => {
    if (!selectedChat) return null;
    
    const isPrivateChat = selectedChat.participants?.length > 0;
    const chatHeader = isPrivateChat 
        ? getChatPartner(selectedChat) 
        : '🌐 Global Chat';

    return (
        <div style={{
            padding: '8px 0',
            borderBottom: '1px solid var(--color-accent)',
            marginBottom: 10,
            fontWeight: 'bold',
            color: 'var(--color-primary)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <span>{chatHeader}</span>
            {isPrivateChat && callState === 'idle' && (
                <button
                    onClick={onStartCall}
                    style={{
                        padding: '5px 10px',
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-bg)',
                        border: 'none',
                        borderRadius: 5,
                        cursor: 'pointer',
                        fontSize: '12px'
                    }}
                >
                    📞 Call
                </button>
            )}
            {callState === 'calling' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Calling...</span>
                    <button
                        onClick={onCancelCall}
                        style={{
                            padding: '3px 8px',
                            backgroundColor: 'var(--color-error)',
                            color: 'var(--color-bg)',
                            border: 'none',
                            borderRadius: 3,
                            cursor: 'pointer',
                            fontSize: '10px'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}
            {callState === 'ringing' && (
                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Ringing...</span>
            )}
            {callState === 'in-call' && (
                <button
                    onClick={onHangUp}
                    style={{
                        padding: '5px 10px',
                        backgroundColor: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: 5,
                        cursor: 'pointer',
                        fontSize: '12px'
                    }}
                >
                    Hang Up
                </button>
            )}
        </div>
    );
};

export default ChatHeader;