import React from 'react';

const VideoCallPopup = ({
    localVideoRef,
    remoteVideoRef,
    onHangUp,
    position,
    size,
    onDragStart,
    onResizeStart
}) => {
    const videoAspectRatio = 16 / 9;
    
    const calculateRemoteVideoStyle = () => {
        const containerAspectRatio = size.width / size.height;
        
        if (containerAspectRatio > videoAspectRatio) {
            return {
                width: `${size.height * videoAspectRatio}px`,
                height: '100%',
                margin: '0 auto'
            };
        } else {
            return {
                width: '100%',
                height: `${size.width / videoAspectRatio}px`,
                margin: 'auto 0'
            };
        }
    };

    const localVideoSize = Math.min(size.width * 0.25, 120);
    const localVideoAspectRatio = 4 / 3;
    
    const localVideoStyle = {
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        width: `${localVideoSize}px`,
        height: `${localVideoSize / localVideoAspectRatio}px`,
        border: '2px solid white',
        borderRadius: '10px',
        objectFit: 'contain',
        backgroundColor: '#000',
        zIndex: 10000,
    };

    const remoteVideoStyle = calculateRemoteVideoStyle();

    return (
        <div
            style={{
                position: 'absolute',
                top: position.y,
                left: position.x,
                width: size.width,
                height: size.height,
                backgroundColor: 'var(--color-bg)',
                borderRadius: '10px',
                boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                zIndex: 9999,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div
                onMouseDown={onDragStart}
                style={{
                    height: '20px',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    cursor: 'grab',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: 'white',
                }}
            >
                Drag to move
            </div>

            <div 
                style={{ 
                    position: 'relative', 
                    flex: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: '#000'
                }}
            >
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    style={{
                        ...remoteVideoStyle,
                        objectFit: 'contain',
                        backgroundColor: '#000',
                    }}
                />
                
                <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    style={localVideoStyle}
                />
                
                <button
                    onClick={onHangUp}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '5px 10px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        zIndex: 10001,
                    }}
                >
                    End
                </button>
            </div>

            <div
                onMouseDown={onResizeStart}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '20px',
                    height: '20px',
                    cursor: 'nw-resize',
                    backgroundColor: 'rgba(255,255,255,0.5)',
                }}
            />
        </div>
    );
};

export default VideoCallPopup;