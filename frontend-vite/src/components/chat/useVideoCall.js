import { useState, useRef, useCallback } from 'react';
import io from 'socket.io-client';

// Ring sound for incoming calls
const ringSound = new Audio('/ring.mp3');

const socket = io(import.meta.env.VITE_SOCKET_URL, {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

export const useVideoCall = (selectedChat) => {
    const [callState, setCallState] = useState('idle');
    const [incomingCall, setIncomingCall] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);
    const [iceCandidatesBuffer, setIceCandidatesBuffer] = useState([]);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const setupSocketListeners = useCallback((callbacks) => {
        const {
            onIncomingCall,
            onCallAccepted,
            onCallRejected,
            onCallEnded,
            onAnswer,
            onIceCandidate
        } = callbacks;

        socket.on('incoming-call', onIncomingCall);
        socket.on('call-accepted', onCallAccepted);
        socket.on('call-rejected', onCallRejected);
        socket.on('call-ended', onCallEnded);
        socket.on('answer', onAnswer);
        socket.on('ice-candidate', onIceCandidate);

        return () => {
            socket.off('incoming-call', onIncomingCall);
            socket.off('call-accepted', onCallAccepted);
            socket.off('call-rejected', onCallRejected);
            socket.off('call-ended', onCallEnded);
            socket.off('answer', onAnswer);
            socket.off('ice-candidate', onIceCandidate);
        };
    }, []);

    const startCall = async () => {
        if (!selectedChat) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;

            const pc = new RTCPeerConnection();
            setPeerConnection(pc);

            stream.getTracks().forEach(track => pc.addTrack(track, stream));

            pc.ontrack = event => {
                setRemoteStream(event.streams[0]);
                if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
            };

            pc.onicecandidate = event => {
                if (event.candidate) {
                    socket.emit('ice-candidate', { chatId: selectedChat._id, candidate: event.candidate });
                }
            };

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit('call-user', { chatId: selectedChat._id, offer });
            setCallState('calling');
        } catch (err) {
            console.error('Error starting call:', err);
            throw new Error('Failed to start call. Check camera/microphone permissions.');
        }
    };

    const acceptCall = async (incomingCallData) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;

            const pc = new RTCPeerConnection();
            setPeerConnection(pc);

            stream.getTracks().forEach(track => pc.addTrack(track, stream));

            pc.ontrack = event => {
                setRemoteStream(event.streams[0]);
                if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
            };

            pc.onicecandidate = event => {
                if (event.candidate) {
                    socket.emit('ice-candidate', { chatId: selectedChat._id, candidate: event.candidate });
                }
            };

            await pc.setRemoteDescription(new RTCSessionDescription(incomingCallData.offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit('answer', { chatId: selectedChat._id, answer });
            socket.emit('accept-call', { chatId: selectedChat._id });
            ringSound.pause();
            ringSound.currentTime = 0;
            setIncomingCall(null);
            setCallState('in-call');
        } catch (err) {
            console.error('Error accepting call:', err);
            throw new Error('Failed to accept call.');
        }
    };

    const rejectCall = () => {
        socket.emit('reject-call', { chatId: selectedChat._id });
        setIncomingCall(null);
        setCallState('idle');
        ringSound.pause();
        ringSound.currentTime = 0;
    };

    const hangUp = () => {
        socket.emit('call-ended', { chatId: selectedChat._id });
        cleanupCall();
    };

    const cancelCall = () => {
        socket.emit('call-ended', { chatId: selectedChat._id });
        cleanupCall();
    };

    const cleanupCall = () => {
        if (peerConnection) {
            peerConnection.close();
            setPeerConnection(null);
        }
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }
        setRemoteStream(null);
        setCallState('idle');
        setIncomingCall(null);
        ringSound.pause();
        ringSound.currentTime = 0;
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    };

    return {
        callState,
        setCallState,
        incomingCall,
        setIncomingCall,
        localStream,
        setLocalStream,
        remoteStream,
        setRemoteStream,
        localVideoRef,
        remoteVideoRef,
        setupSocketListeners,
        startCall,
        acceptCall,
        rejectCall,
        hangUp,
        cancelCall,
        cleanupCall
    };
};