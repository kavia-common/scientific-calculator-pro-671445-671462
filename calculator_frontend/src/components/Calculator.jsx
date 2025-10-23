import React, { useEffect, useMemo, useState } from 'react';
import Display from './Display';
import Keypad from './Keypad';
import useCalculator from '../hooks/useCalculator';

// PUBLIC_INTERFACE
export default function Calculator() {
  /**
   * Calculator is the top-level component managing expression, result,
   * and calculator mode (deg/rad). It wires the keypad and display while
   * handling keyboard inputs and error states.
   */
  const [theme, setTheme] = useState('light');
  const { state, actions } = useCalculator();

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Keyboard support
  useEffect(() => {
    const handler = (e) => {
      const key = e.key;

      // Prevent default for some keys to avoid browser navigation
      if (['/', '*', '-', '+', 'Enter', 'Backspace', 'Escape', '(', ')', '.'].includes(key)) {
        e.preventDefault();
      }

      // Digits
      if (/\d/.test(key)) {
        actions.inputDigit(key);
        return;
      }
      // Operators
      if (key === '+' || key === '-' || key === '*' || key === '/') {
        actions.inputOperator(key);
        return;
      }
      if (key === '^') {
        actions.inputOperator('^');
        return;
      }
      if (key === '(') {
        actions.inputParenthesis('(');
        return;
      }
      if (key === ')') {
        actions.inputParenthesis(')');
        return;
      }
      if (key === '.') {
        actions.inputDecimal();
        return;
      }
      if (key === 'Enter' || key === '=') {
        actions.evaluate();
        return;
      }
      if (key === 'Backspace') {
        actions.deleteOne();
        return;
      }
      if (key === 'Escape') {
        actions.clearAll();
        return;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [actions]);

  const onButtonPress = useMemo(
    () => ({
      digit: (d) => actions.inputDigit(d),
      op: (op) => actions.inputOperator(op),
      decimal: () => actions.inputDecimal(),
      equals: () => actions.evaluate(),
      clear: () => actions.clearAll(),
      delete: () => actions.deleteOne(),
      paren: (p) => actions.inputParenthesis(p),
      sign: () => actions.toggleSign(),
      func: (f) => actions.inputFunction(f),
      sqrt: () => actions.inputFunction('sqrt'),
      pow: () => actions.inputOperator('^'),
      toggleMode: () => actions.toggleAngleMode(),
    }),
    [actions]
  );

  return (
    <div className="calculator-shell">
      <div className="calc-header">
        <div className="brand">
          <span className="brand-main">Scientific</span>
          <span className="brand-sub">Calculator</span>
        </div>
        <div className="header-controls">
          <button
            className="btn mode-toggle"
            onClick={onButtonPress.toggleMode}
            aria-label={`Toggle angle mode (currently ${state.angleMode})`}
          >
            {state.angleMode === 'DEG' ? 'DEG' : 'RAD'}
          </button>
          <button
            className="btn theme-toggle"
            onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            title="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>

      <Display expression={state.expression} result={state.result} error={state.error} />

      <Keypad onPress={onButtonPress} />
    </div>
  );
}
