import React from 'react';

const MessageInput = ({ 
    newMessage, 
    setNewMessage, 
    handleSendMessage, 
    user, 
    selectedChat, 
    isLoading 
}) => {
    return (
        <form onSubmit={handleSendMessage} style={{ display: 'flex', marginTop: 10 }}>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={user ? "Type a message..." : "Log in to chat."}
                disabled={!user || !selectedChat || isLoading}
                style={{
                    flex: 1,
                    padding: 10,
                    backgroundColor: 'var(--color-card-bg)',
                    border: '1px solid var(--color-accent)',
                    borderRadius: 5,
                    color: 'var(--color-text)',
                    marginRight: 5,
                }}
            />
            <button
                type="submit"
                disabled={!user || !selectedChat || isLoading || !newMessage.trim()}
                style={{
                    padding: '10px 16px',
                    backgroundColor: (user && selectedChat && !isLoading && newMessage.trim()) ? 'var(--color-primary)' : 'var(--color-button-bg)',
                    color: (user && selectedChat && !isLoading && newMessage.trim()) ? 'var(--color-bg)' : 'var(--color-text-secondary)',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: 5,
                    cursor: (user && selectedChat && !isLoading && newMessage.trim()) ? 'pointer' : 'not-allowed',
                }}
            >
                {isLoading ? 'Send' : 'Send'}
            </button>
        </form>
    );
};

export default MessageInput;