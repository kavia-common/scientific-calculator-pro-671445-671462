import React from 'react';
import './styles/theme.css';
import './styles/app.css';
import Calculator from './components/Calculator';

// PUBLIC_INTERFACE
export default function App() {
  /** App component sets global theme styles and renders the Calculator UI. */
  return (
    <div className="app-root">
      <Calculator />
    </div>
  );
}
