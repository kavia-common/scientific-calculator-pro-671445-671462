import { useCallback, useMemo, useState } from 'react';
import { evaluateExpression, formatNumber } from '../utils/mathEngine';

const initialState = {
  expression: '',
  result: '0',
  error: '',
  angleMode: 'DEG', // or 'RAD'
};

// PUBLIC_INTERFACE
export default function useCalculator() {
  /**
   * useCalculator provides calculator state and actions:
   * - inputDigit, inputOperator, inputDecimal, inputParenthesis
   * - inputFunction (sin, cos, tan, sqrt)
   * - toggleSign, clearAll, deleteOne, evaluate, toggleAngleMode
   */
  const [state, setState] = useState(initialState);

  const setError = useCallback((msg) => {
    setState((s) => ({ ...s, error: msg }));
  }, []);

  const clearError = useCallback(() => {
    setState((s) => ({ ...s, error: '' }));
  }, []);

  const inputDigit = useCallback((d) => {
    clearError();
    setState((s) => ({ ...s, expression: s.expression + d }));
  }, [clearError]);

  const inputOperator = useCallback((op) => {
    clearError();
    setState((s) => {
      if (!s.expression) return s; // ignore operator at start
      return { ...s, expression: s.expression + op };
    });
  }, [clearError]);

  const inputDecimal = useCallback(() => {
    clearError();
    setState((s) => ({ ...s, expression: s.expression + '.' }));
  }, [clearError]);

  const inputParenthesis = useCallback((p) => {
    clearError();
    setState((s) => ({ ...s, expression: s.expression + p }));
  }, [clearError]);

  const inputFunction = useCallback((fn) => {
    clearError();
    // append function token followed by '(' to make entry easier: e.g., sin(
    setState((s) => ({ ...s, expression: s.expression + fn + '(' }));
  }, [clearError]);

  const toggleSign = useCallback(() => {
    clearError();
    setState((s) => {
      // Naive approach: wrap the whole expression in negation if simple number,
      // otherwise try to append unary minus
      if (!s.expression) {
        return { ...s, expression: '-' };
      }
      // If last is a digit or ), we insert a negation of next number by adding '±' is not parseable, so implement by toggling last number
      const match = s.expression.match(/(-?\d*\.?\d+)$|(\))$/);
      if (match && match[1]) {
        const num = match[1];
        const toggled = num.startsWith('-') ? num.slice(1) : '-' + num;
        const newExpr = s.expression.slice(0, s.expression.length - num.length) + toggled;
        return { ...s, expression: newExpr };
      }
      // else start a negative number
      return { ...s, expression: s.expression + '(-' };
    });
  }, [clearError]);

  const clearAll = useCallback(() => {
    setState(initialState);
  }, []);

  const deleteOne = useCallback(() => {
    clearError();
    setState((s) => ({ ...s, expression: s.expression.slice(0, -1) }));
  }, [clearError]);

  const evaluate = useCallback(() => {
    try {
      const { value, error } = evaluateExpression(state.expression, state.angleMode);
      if (error) {
        setState((s) => ({ ...s, result: 'Error', error }));
      } else {
        setState((s) => ({
          ...s,
          result: formatNumber(value),
          error: '',
        }));
      }
    } catch (e) {
      setError('Invalid Expression');
    }
  }, [setError, state.angleMode, state.expression]);

  const toggleAngleMode = useCallback(() => {
    setState((s) => ({
      ...s,
      angleMode: s.angleMode === 'DEG' ? 'RAD' : 'DEG',
    }));
  }, []);

  const actions = useMemo(
    () => ({
      inputDigit,
      inputOperator,
      inputDecimal,
      inputParenthesis,
      inputFunction,
      toggleSign,
      clearAll,
      deleteOne,
      evaluate,
      toggleAngleMode,
    }),
    [
      inputDigit,
      inputOperator,
      inputDecimal,
      inputParenthesis,
      inputFunction,
      toggleSign,
      clearAll,
      deleteOne,
      evaluate,
      toggleAngleMode,
    ]
  );

  return { state, actions };
}
