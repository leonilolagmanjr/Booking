import React from 'react';
import UserLink from '../UserLink';

const MessageList = ({ messages, user, isLoading, bottomRef }) => {
    if (isLoading && messages.length === 0) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>Loading Messages...</div>;
    }

    return (
        <>
            {messages.map((msg) => (
                <div
                    key={msg._id || msg.createdAt}
                    style={{
                        margin: '6px 0',
                        backgroundColor: msg.sender?._id === user?.id ? 'var(--color-card-bg)' : 'var(--color-button-bg)',
                        padding: '8px 12px',
                        borderRadius: 10,
                        alignSelf: msg.sender?._id === user?.id ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        lineHeight: '1.4',
                    }}
                >
                    <b style={{ color: 'var(--color-text-secondary)' }}>
                        {msg.sender?._id === user?.id ? (
                            'You'
                        ) : (
                            <UserLink
                                userId={msg.sender?._id}
                                name={msg.sender?.name || 'Unknown'}
                                sx={{ color: 'var(--color-primary)', textDecoration: 'none' }}
                            />
                        )}
                    </b>
                    <span style={{ display: 'block', wordWrap: 'break-word' }}>{msg.content}</span>
                    <small style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginTop: '4px', display: 'block' }}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </small>
                </div>
            ))}
            <div ref={bottomRef} />
        </>
    );
};

export default MessageList;