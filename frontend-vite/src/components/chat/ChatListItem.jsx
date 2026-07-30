import React from 'react';
import UserLink from '../UserLink';
import { isGlobalChat } from './ChatWidgetUtils';

const ChatListItem = ({ 
    chat, 
    user, 
    selectedChat, 
    onSelectChat, 
    isFirstGlobalChat 
}) => {
    if (isGlobalChat(chat)) {
        return (
            <div
                style={{
                    color: 'var(--color-primary)',
                    marginBottom: 10,
                    paddingTop: 0,
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    backgroundColor: selectedChat?._id === chat._id ? 'var(--color-accent)' : 'transparent',
                    padding: '8px',
                    borderRadius: 5,
                    borderBottom: '1px solid var(--color-accent)',
                }}
                onClick={() => onSelectChat(chat)}
            >
                <div style={{ fontWeight: 'bold' }}>🌐 Global Chat</div>
                <small style={{
                    color: 'var(--color-text-secondary)', 
                    overflow: 'hidden', 
                    whiteSpace: 'nowrap', 
                    textOverflow: 'ellipsis', 
                    display: 'block'
                }}>
                    {chat.lastMessage || 'Chat with everyone'}
                </small>
            </div>
        );
    }

    const partner = chat.participants.find(p => p._id !== user?.id);
    
    return (
        <div
            onClick={() => onSelectChat(chat)}
            style={{
                padding: '8px',
                marginBottom: 6,
                cursor: 'pointer',
                borderRadius: 5,
                backgroundColor: selectedChat?._id === chat._id ? 'var(--color-accent)' : 'transparent',
                transition: '0.2s',
                border: '1px solid transparent',
            }}
        >
            <div style={{ fontWeight: 'bold' }}>
                <UserLink userId={partner?._id} name={partner?.name} />
            </div>
            <small style={{
                color: 'var(--color-text-secondary)', 
                overflow: 'hidden', 
                whiteSpace: 'nowrap', 
                textOverflow: 'ellipsis', 
                display: 'block'
            }}>
                {chat.lastMessage || 'Start a conversation.'}
            </small>
        </div>
    );
};

export default ChatListItem;