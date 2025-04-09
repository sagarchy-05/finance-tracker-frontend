import React from 'react';

function LoadingButton({ loading, children, className = '', ...props }) {
  return (
    <button className={`btn ${className}`} disabled={loading} {...props}>
      {loading ? (
        <>
          <span
            className='spinner-border spinner-border-sm me-2'
            role='status'
            aria-hidden='true'
          />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default LoadingButton;
