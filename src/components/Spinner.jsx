import React from 'react';

const Spinner = ({ fullScreen = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  return (
    <div
      className={`d-flex justify-content-center align-items-center ${
        fullScreen ? 'vh-100' : ''
      }`}
      style={!fullScreen ? { minHeight: '200px' } : {}}
    >
      <div
        className={`spinner-border text-primary ${sizeClasses[size]}`}
        role='status'
        style={{
          width: size === 'sm' ? '2rem' : size === 'lg' ? '4rem' : '3rem',
          height: size === 'sm' ? '2rem' : size === 'lg' ? '4rem' : '3rem',
        }}
      >
        <span className='visually-hidden'>Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
