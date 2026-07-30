const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            // Keep your origins, but normalize by removing trailing slash
            origin: process.env.WEBSOCKET_ORIGINS,
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        //console.log('A user connected:', socket.id);

        // This remains necessary: clients join a room specific to the chat ID
        socket.on('joinChat', (chatId) => {
            socket.join(chatId);
            console.log(`User joined chat: ${chatId}`);
        });

        // Add a leave chat event for better room management
        socket.on('leaveChat', (chatId) => {
            socket.leave(chatId);
            console.log(`User left chat: ${chatId}`);
        });

        // CRITICAL: The 'sendMessage' listener is REMOVED.
        // Broadcasting is now handled reliably by the chatService after DB save.

        // WebRTC Signaling for Video Calls
        socket.on('call-user', ({ chatId, offer }) => {
            const room = io.sockets.adapter.rooms.get(chatId);
            if (room) {
                const sockets = Array.from(room);
                const otherSocketId = sockets.find(id => id !== socket.id);
                if (otherSocketId) {
                    io.to(otherSocketId).emit('incoming-call', { offer, callerId: socket.id });
                }
            }
        });

        socket.on('accept-call', ({ chatId }) => {
            const room = io.sockets.adapter.rooms.get(chatId);
            if (room) {
                const sockets = Array.from(room);
                const otherSocketId = sockets.find(id => id !== socket.id);
                if (otherSocketId) {
                    io.to(otherSocketId).emit('call-accepted');
                }
            }
        });

        socket.on('reject-call', ({ chatId }) => {
            const room = io.sockets.adapter.rooms.get(chatId);
            if (room) {
                const sockets = Array.from(room);
                const otherSocketId = sockets.find(id => id !== socket.id);
                if (otherSocketId) {
                    io.to(otherSocketId).emit('call-rejected');
                }
            }
        });

        socket.on('answer', ({ chatId, answer }) => {
            const room = io.sockets.adapter.rooms.get(chatId);
            if (room) {
                const sockets = Array.from(room);
                const otherSocketId = sockets.find(id => id !== socket.id);
                if (otherSocketId) {
                    io.to(otherSocketId).emit('answer', answer);
                }
            }
        });

        socket.on('ice-candidate', ({ chatId, candidate }) => {
            const room = io.sockets.adapter.rooms.get(chatId);
            if (room) {
                const sockets = Array.from(room);
                const otherSocketId = sockets.find(id => id !== socket.id);
                if (otherSocketId) {
                    io.to(otherSocketId).emit('ice-candidate', candidate);
                }
            }
        });

        socket.on('call-busy', ({ targetId }) => {
            io.to(targetId).emit('call-rejected', { reason: 'busy' });
        });

        socket.on('call-ended', ({ chatId }) => {
            const room = io.sockets.adapter.rooms.get(chatId);
            if (room) {
                const sockets = Array.from(room);
                const otherSocketId = sockets.find(id => id !== socket.id);
                if (otherSocketId) {
                    io.to(otherSocketId).emit('call-ended');
                }
            }
        });

        socket.on('disconnect', () => {
            //console.log('A user disconnected:', socket.id);
        });
    });
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

module.exports = { initSocket, getIO };