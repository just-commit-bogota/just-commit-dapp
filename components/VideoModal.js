import React, { useEffect, useRef } from 'react';

const VideoModal = ({ closeModal, videoEmbedUrl }) => {

  const handleCloseClick = (e) => {
    e.stopPropagation();
    closeModal();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={closeModal}
    >
      <div
        style={{
          position: 'relative',
          width: '80%',
          height: '80%',
          backgroundColor: 'white',
          borderRadius: '10px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleCloseClick}
          style={{
            position: 'absolute',
            top: '-60px',  // Adjust this to position button vertically
            right: '-60px', // Adjust this to position button horizontally
            backgroundColor: 'transparent',
            color: 'white',
            border: 'none',
            fontSize: '4em',  // Increase this to make button larger
            cursor: 'pointer',
          }}
        >
          &times;
        </button>
        <iframe
          src={videoEmbedUrl}
          frameBorder="0"
          allowFullScreen
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            borderRadius: '10px',
          }}
        ></iframe>
      </div>
    </div>
  );
};

export default VideoModal;
