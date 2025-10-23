import React from 'react';
import Button from './Button';

// PUBLIC_INTERFACE
export default function Keypad({ onPress }) {
  /**
   * Keypad renders calculator keys and wires their events.
   * onPress: { digit, op, decimal, equals, clear, delete, paren, sign, func, sqrt, pow }
   */
  return (
    <div className="keypad">
      <div className="row scientific">
        <Button label="sin" className="key-fn" onClick={() => onPress.func('sin')} ariaLabel="sine" />
        <Button label="cos" className="key-fn" onClick={() => onPress.func('cos')} ariaLabel="cosine" />
        <Button label="tan" className="key-fn" onClick={() => onPress.func('tan')} ariaLabel="tangent" />
        <Button label="√" className="key-fn" onClick={() => onPress.sqrt()} ariaLabel="square root" />
        <Button label="xʸ" className="key-fn" onClick={() => onPress.pow()} ariaLabel="power" />
      </div>

      <div className="row utilities">
        <Button label="AC" className="key-util" onClick={onPress.clear} ariaLabel="all clear" />
        <Button label="DEL" className="key-util" onClick={onPress.delete} ariaLabel="delete" />
        <Button label="(" className="key-util" onClick={() => onPress.paren('(')} ariaLabel="left parenthesis" />
        <Button label=")" className="key-util" onClick={() => onPress.paren(')')} ariaLabel="right parenthesis" />
        <Button label="±" className="key-util" onClick={onPress.sign} ariaLabel="toggle sign" />
      </div>

      <div className="grid">
        <Button label="7" onClick={() => onPress.digit('7')} />
        <Button label="8" onClick={() => onPress.digit('8')} />
        <Button label="9" onClick={() => onPress.digit('9')} />
        <Button label="÷" className="key-op" onClick={() => onPress.op('/')} ariaLabel="divide" />

        <Button label="4" onClick={() => onPress.digit('4')} />
        <Button label="5" onClick={() => onPress.digit('5')} />
        <Button label="6" onClick={() => onPress.digit('6')} />
        <Button label="×" className="key-op" onClick={() => onPress.op('*')} ariaLabel="multiply" />

        <Button label="1" onClick={() => onPress.digit('1')} />
        <Button label="2" onClick={() => onPress.digit('2')} />
        <Button label="3" onClick={() => onPress.digit('3')} />
        <Button label="−" className="key-op" onClick={() => onPress.op('-')} ariaLabel="subtract" />

        <Button label="0" className="span-2" onClick={() => onPress.digit('0')} />
        <Button label="." onClick={onPress.decimal} ariaLabel="decimal point" />
        <Button label="+" className="key-op" onClick={() => onPress.op('+')} ariaLabel="add" />

        <Button label="=" className="key-eq span-4" onClick={onPress.equals} ariaLabel="equals" />
      </div>
    </div>
  );
}
