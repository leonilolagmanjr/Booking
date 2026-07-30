// Utility functions for ChatWidget
export const isGlobalChat = (chat) => chat.participants && chat.participants.length === 0;

export const getChatPartner = (chat, user) => {
    if (isGlobalChat(chat)) return '🌐 Global Chat';
    
    const partner = chat.participants.find(p => p._id !== user?.id);
    return partner?.name || 'Unknown User';
};

export const scrollToBottom = (bottomRef) => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
};