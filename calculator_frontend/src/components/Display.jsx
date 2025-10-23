import React from 'react';

// PUBLIC_INTERFACE
export default function Display({ expression, result, error }) {
  /**
   * Display shows the current expression and result. Errors are indicated with
   * distinct styling and accessible labels.
   */
  return (
    <div className="display" role="group" aria-label="calculator display">
      <div className="expression" aria-live="polite" aria-atomic="true">
        {expression || '0'}
      </div>
      <div
        className={`result ${error ? 'result-error' : ''}`}
        aria-live="polite"
        aria-atomic="true"
      >
        {error ? error : result}
      </div>
    </div>
  );
}
