import React from 'react';

// PUBLIC_INTERFACE
export default function Button({ label, onClick, className = '', ariaLabel }) {
  /** Button is a styled, accessible calculator button. */
  return (
    <button
      className={`btn key ${className}`}
      onClick={onClick}
      aria-label={ariaLabel || label}
    >
      {label}
    </button>
  );
}
