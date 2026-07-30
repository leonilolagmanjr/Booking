import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import io from 'socket.io-client';
import {
    getChats,
    getMessages,
    sendMessage as apiSendMessage,
    getOrCreateChat,
} from '../../services/chatApi';
import { useAuth } from '../../context/AuthContext';
import { FriendContext } from '../../context/FriendContext';
import VideoCallPopup from './VideoCallPopup';
import ChatHeader from './ChatHeader';
import IncomingCallNotification from './IncommingCallNotification';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ChatListItem from './ChatListItem';
import { useVideoCall } from './useVideoCall';
import { isGlobalChat, getChatPartner, scrollToBottom } from './ChatWidgetUtils';

const socket = io(import.meta.env.VITE_SOCKET_URL, {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

const ChatWidget = () => {
    const { user } = useAuth();
    const { friendListUpdated, openChatUserId, clearOpenChatUser } = useContext(FriendContext);
    
    const [isOpen, setIsOpen] = useState(false);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatError, setChatError] = useState('');
    const [popupPosition, setPopupPosition] = useState({ x: window.innerWidth - 420, y: window.innerHeight - 320 });
    const [popupSize, setPopupSize] = useState({ width: 400, height: 300 });

    const bottomRef = useRef(null);
    const refreshIntervalRef = useRef(null);

    const videoCall = useVideoCall(selectedChat);

    // Drag and Resize Handlers
    const handleDragStart = useCallback((e) => {
        e.preventDefault();
        const startX = e.clientX - popupPosition.x;
        const startY = e.clientY - popupPosition.y;

        const handleMouseMove = (e) => {
            let newX = e.clientX - startX;
            let newY = e.clientY - startY;

            newX = Math.max(0, Math.min(newX, window.innerWidth - popupSize.width));
            newY = Math.max(0, Math.min(newY, window.innerHeight - popupSize.height));

            setPopupPosition({ x: newX, y: newY });
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [popupPosition, popupSize]);

    const handleResizeStart = useCallback((e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = popupSize.width;
        const startHeight = popupSize.height;
        const aspectRatio = 16 / 9;

        const handleMouseMove = (e) => {
            let deltaX = e.clientX - startX;
            let deltaY = e.clientY - startY;

            let newWidth = startWidth + deltaX;
            let newHeight = startHeight + deltaY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                newHeight = newWidth / aspectRatio;
            } else {
                newWidth = newHeight * aspectRatio;
            }

            const minWidth = 320;
            const minHeight = minWidth / aspectRatio;
            newWidth = Math.max(minWidth, newWidth);
            newHeight = Math.max(minHeight, newHeight);

            if (popupPosition.x + newWidth > window.innerWidth) {
                newWidth = window.innerWidth - popupPosition.x;
                newHeight = newWidth / aspectRatio;
            }
            if (popupPosition.y + newHeight > window.innerHeight) {
                newHeight = window.innerHeight - popupPosition.y;
                newWidth = newHeight * aspectRatio;
            }

            setPopupSize({ width: newWidth, height: newHeight });
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [popupSize, popupPosition]);

    const refreshMessages = useCallback(async () => {
        if (!selectedChat?._id || !user) return;

        try {
            const res = await getMessages(selectedChat._id);
            setMessages(res.data);
        } catch (err) {
            console.error('Failed to refresh messages', err);
        }
    }, [selectedChat?._id, user]);

    const refreshChatList = useCallback(async () => {
        if (!user) return;
        
        try {
            const res = await getChats();
            const globalChat = res.data.find(isGlobalChat);
            const privateChats = res.data
                .filter(chat => !isGlobalChat(chat))
                .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));

            setChats(globalChat ? [globalChat, ...privateChats] : privateChats);
        } catch (err) {
            console.error('Failed to refresh chat list', err);
        }
    }, [user]);

    useEffect(() => {
        if (isOpen) {
            refreshIntervalRef.current = setInterval(() => {
                if (selectedChat) {
                    refreshMessages();
                }
                refreshChatList();
            }, 2000);
        }

        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
                refreshIntervalRef.current = null;
            }
        };
    }, [isOpen, selectedChat, refreshMessages, refreshChatList]);

    const fetchChats = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        setChatError('');
        try {
            const res = await getChats();
            const globalChat = res.data.find(isGlobalChat);
            const privateChats = res.data
                .filter(chat => !isGlobalChat(chat))
                .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));

            setChats(globalChat ? [globalChat, ...privateChats] : privateChats);
        } catch (err) {
            console.error('Failed to fetch chats', err);
            setChatError('Failed to load chats.');
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const fetchMessages = useCallback(async (chatId) => {
        if (!chatId) return;
        setIsLoading(true);
        setChatError('');
        try {
            const res = await getMessages(chatId);
            setMessages(res.data);
        } catch (err) {
            console.error('Failed to fetch messages', err);
            setChatError('Failed to load messages.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSelectChat = async (chat) => {
        setSelectedChat(chat);
        setMessages([]);
        await fetchMessages(chat._id);
    };

    const handleGetOrCreateChat = useCallback(async (otherUserId = null) => {
        if (!user) {
            setChatError('You must be logged in to chat.');
            return;
        }
        setIsLoading(true);
        setChatError('');
        try {
            const res = await getOrCreateChat(otherUserId); 
            await fetchChats();
            
            setSelectedChat(res.data);
            await fetchMessages(res.data._id);
            setIsOpen(true);
        } catch (err) {
            console.error('Failed to fetch or create chat', err);
            setChatError(err.response?.data?.msg || 'Failed to open chat.');
        } finally {
            setIsLoading(false);
        }
    }, [user, fetchChats, fetchMessages]);

    useEffect(() => {
        if (!selectedChat?._id) return;

        const chatId = selectedChat._id;
        socket.emit('joinChat', chatId);

        const handleReceiveMessage = (message) => {
            if (message.chat === chatId) {
                setMessages((prev) => [...prev, message]);

                setChats(prevChats => {
                    const updatedChats = prevChats.map(chat =>
                        chat._id === chatId ? { ...chat, lastMessage: message.content, lastUpdated: message.createdAt } : chat
                    );

                    const globalChat = updatedChats.find(isGlobalChat);
                    const privateChats = updatedChats
                        .filter(chat => !isGlobalChat(chat))
                        .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));

                    return globalChat ? [globalChat, ...privateChats] : privateChats;
                });
            }
        };

        socket.on('receiveMessage', handleReceiveMessage);

        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
            socket.emit('leaveChat', chatId);
        };
    }, [selectedChat?._id]);

    useEffect(() => {
        scrollToBottom(bottomRef);
    }, [messages, selectedChat]);

    useEffect(() => {
        if (isOpen && user) {
            fetchChats();
        }
    }, [isOpen, user, fetchChats, friendListUpdated]);

    useEffect(() => {
        if (openChatUserId) {
            handleGetOrCreateChat(openChatUserId);
            clearOpenChatUser();
        }
    }, [openChatUserId, clearOpenChatUser, handleGetOrCreateChat]);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!newMessage.trim() || !selectedChat || !user || isLoading) return;

        const content = newMessage.trim();
        setNewMessage('');
        setChatError('');

        try {
            const isGlobal = isGlobalChat(selectedChat);
            const otherParticipant = selectedChat.participants.find(p => p._id !== user.id);
            const receiverId = isGlobal ? null : otherParticipant?._id;

            await apiSendMessage({
                chatId: selectedChat._id,
                receiverId: receiverId,
                content: content,
            });

            setChats(prevChats => {
                 const updatedChats = prevChats.map(chat =>
                    chat._id === selectedChat._id ? { ...chat, lastMessage: content, lastUpdated: new Date().toISOString() } : chat
                );

                const globalChat = updatedChats.find(isGlobalChat);
                const privateChats = updatedChats
                    .filter(chat => !isGlobalChat(chat))
                    .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));

                return globalChat ? [globalChat, ...privateChats] : privateChats;
            });

        } catch (err) {
            console.error('Failed to send message', err);
            setChatError(err.response?.data?.msg || 'Failed to send message.');
            setNewMessage(content);
        }
    };

    const renderChatContent = () => {
        if (!selectedChat) {
             return (
                <div style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)', color: 'var(--color-primary)', padding: 20 }}>
                    Select a chat from the list to start messaging.
                </div>
            );
        }

        return (
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', padding: 10 }}>
                <ChatHeader
                    selectedChat={selectedChat}
                    user={user}
                    callState={videoCall.callState}
                    onStartCall={videoCall.startCall}
                    onCancelCall={videoCall.cancelCall}
                    onHangUp={videoCall.hangUp}
                    getChatPartner={(chat) => getChatPartner(chat, user)}
                />

                <IncomingCallNotification
                    incomingCall={videoCall.incomingCall}
                    getChatPartner={(chat) => getChatPartner(chat, user)}
                    selectedChat={selectedChat}
                    onAcceptCall={() => videoCall.acceptCall(videoCall.incomingCall)}
                    onRejectCall={videoCall.rejectCall}
                />

                <div style={{ flex: 1, overflowY: 'auto', paddingRight: 8, display: 'flex', flexDirection: 'column' }}>
                    <MessageList
                        messages={messages}
                        user={user}
                        isLoading={isLoading}
                        bottomRef={bottomRef}
                    />
                </div>

                <MessageInput
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    handleSendMessage={handleSendMessage}
                    user={user}
                    selectedChat={selectedChat}
                    isLoading={isLoading}
                />
                
                {chatError && (
                    <div style={{ color: 'red', marginTop: 5, textAlign: 'center' }}>{chatError}</div>
                )}
            </div>
        );
    };

    if (!user) return null;
    
    return (
        <div className="chat-widget">
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="chat-widget-toggle"
            >
                💬
            </button>

            {isOpen && (
                <div className="chat-widget-window">
                    <div
                        style={{
                            flex: 1.2, borderRight: '1px solid var(--color-accent)', padding: 10,
                            backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text)', overflowY: 'auto',
                        }}
                    >
                        {isLoading && !chats.length && <div style={{color: 'var(--color-text-secondary)'}}>Loading Chats...</div>}

                        {chats.map((chat, index) => {
                            const isFirstGlobalChat = index === 0 && isGlobalChat(chat);
                            
                            return (
                                <React.Fragment key={chat._id}>
                                    {isFirstGlobalChat && <h4 style={{ color: 'var(--color-primary)', marginBottom: 10, marginTop: 10 }}>Private Chats</h4>}
                                    
                                    <ChatListItem
                                        chat={chat}
                                        user={user}
                                        selectedChat={selectedChat}
                                        onSelectChat={handleSelectChat}
                                        isFirstGlobalChat={isFirstGlobalChat}
                                    />
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {renderChatContent()}
                </div>
            )}

            {videoCall.callState === 'in-call' && (
                <VideoCallPopup
                    localVideoRef={videoCall.localVideoRef}
                    remoteVideoRef={videoCall.remoteVideoRef}
                    onHangUp={videoCall.hangUp}
                    position={popupPosition}
                    size={popupSize}
                    onDragStart={handleDragStart}
                    onResizeStart={handleResizeStart}
                />
            )}
        </div>
    );
};

export default ChatWidget;