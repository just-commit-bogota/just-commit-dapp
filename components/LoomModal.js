import React, { useEffect, useRef } from 'react';

const LoomModal = ({ closeModal, videoEmbedUrl }) => {

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
          width: '90%',
          height: '90%',
          backgroundColor: 'white',
          position: 'relative',
          borderRadius: '10px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleCloseClick}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '1.5em',
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

export default LoomModal;
