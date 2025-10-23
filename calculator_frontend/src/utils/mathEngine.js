const OPS = {
  '+': { prec: 2, assoc: 'L', args: 2, fn: (a, b) => a + b },
  '-': { prec: 2, assoc: 'L', args: 2, fn: (a, b) => a - b },
  '*': { prec: 3, assoc: 'L', args: 2, fn: (a, b) => a * b },
  '/': {
    prec: 3,
    assoc: 'L',
    args: 2,
    fn: (a, b) => {
      if (b === 0) throw new Error('Divide by zero');
      return a / b;
    },
  },
  '^': { prec: 4, assoc: 'R', args: 2, fn: (a, b) => Math.pow(a, b) },
  'u-': { prec: 5, assoc: 'R', args: 1, fn: (a) => -a }, // unary minus
};

const FUNCS = {
  sqrt: { args: 1, fn: (a) => {
    if (a < 0) throw new Error('Invalid sqrt');
    return Math.sqrt(a);
  }},
  sin: { args: 1, fn: (a, mode) => Math.sin(mode === 'DEG' ? toRad(a) : a) },
  cos: { args: 1, fn: (a, mode) => Math.cos(mode === 'DEG' ? toRad(a) : a) },
  tan: { args: 1, fn: (a, mode) => Math.tan(mode === 'DEG' ? toRad(a) : a) },
};

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function isDigit(ch) {
  return /[0-9]/.test(ch);
}

function isLetter(ch) {
  return /[a-zA-Z]/.test(ch);
}

function isOperator(ch) {
  return ['+', '-', '*', '/', '^'].includes(ch);
}

function tokenize(expr) {
  const tokens = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];

    if (ch === ' ') {
      i += 1;
      continue;
    }
    if (isDigit(ch) || (ch === '.' && isDigit(expr[i + 1] || ''))) {
      // number (supports decimal)
      let num = ch;
      i += 1;
      while (i < expr.length && (isDigit(expr[i]) || expr[i] === '.')) {
        num += expr[i++];
      }
      tokens.push({ type: 'number', value: parseFloat(num) });
      continue;
    }
    if (isLetter(ch)) {
      let name = ch;
      i += 1;
      while (i < expr.length && isLetter(expr[i])) {
        name += expr[i++];
      }
      if (FUNCS[name]) {
        tokens.push({ type: 'func', value: name });
        continue;
      }
      throw new Error('Unknown identifier: ' + name);
    }
    if (isOperator(ch)) {
      tokens.push({ type: 'op', value: ch });
      i += 1;
      continue;
    }
    if (ch === '(' || ch === ')') {
      tokens.push({ type: 'paren', value: ch });
      i += 1;
      continue;
    }
    // Unknown character
    throw new Error('Invalid character: ' + ch);
  }
  return tokens;
}

function toRPN(tokens) {
  const output = [];
  const stack = [];
  let prev = null;

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    switch (t.type) {
      case 'number':
        output.push(t);
        break;
      case 'func':
        stack.push(t);
        break;
      case 'op': {
        // handle unary minus
        const isUnaryMinus = t.value === '-' && (!prev || (prev.type !== 'number' && !(prev.type === 'paren' && prev.value === ')')));
        const opToken = isUnaryMinus ? { type: 'op', value: 'u-' } : t;
        const o1 = OPS[opToken.value];
        if (!o1) throw new Error('Unknown operator');
        while (stack.length) {
          const top = stack[stack.length - 1];
          if (top.type === 'op') {
            const o2 = OPS[top.value];
            if (
              (o2 && ((o1.assoc === 'L' && o1.prec <= o2.prec) || (o1.assoc === 'R' && o1.prec < o2.prec)))
            ) {
              output.push(stack.pop());
              continue;
            }
          } else if (top.type === 'func') {
            output.push(stack.pop());
            continue;
          }
          break;
        }
        stack.push(opToken);
        break;
      }
      case 'paren':
        if (t.value === '(') {
          stack.push(t);
        } else {
          // ')'
          let foundLeft = false;
          while (stack.length) {
            const top = stack.pop();
            if (top.type === 'paren' && top.value === '(') {
              foundLeft = true;
              break;
            }
            output.push(top);
          }
          if (!foundLeft) throw new Error('Mismatched parentheses');
          // After closing paren, if the top is a function, pop it to output
          if (stack.length && stack[stack.length - 1].type === 'func') {
            output.push(stack.pop());
          }
        }
        break;
      default:
        throw new Error('Invalid token');
    }
    prev = t;
  }

  while (stack.length) {
    const top = stack.pop();
    if (top.type === 'paren') throw new Error('Mismatched parentheses');
    output.push(top);
  }

  return output;
}

function evalRPN(rpn, angleMode) {
  const st = [];
  for (let i = 0; i < rpn.length; i++) {
    const t = rpn[i];
    if (t.type === 'number') {
      st.push(t.value);
    } else if (t.type === 'op') {
      const spec = OPS[t.value];
      if (!spec) throw new Error('Unknown operator');
      const argc = spec.args;
      if (st.length < argc) throw new Error('Invalid expression');
      const args = st.splice(st.length - argc);
      const v = spec.fn(...args);
      st.push(v);
    } else if (t.type === 'func') {
      const spec = FUNCS[t.value];
      if (!spec) throw new Error('Unknown function');
      const argc = spec.args;
      if (st.length < argc) throw new Error('Invalid expression');
      const args = st.splice(st.length - argc);
      const v = spec.fn(...args, angleMode);
      st.push(v);
    } else {
      throw new Error('Invalid token in RPN');
    }
  }
  if (st.length !== 1) throw new Error('Invalid expression');
  return st[0];
}

// PUBLIC_INTERFACE
export function evaluateExpression(expr, angleMode = 'DEG') {
  /**
   * Safely evaluate expression using shunting-yard and RPN evaluation.
   * Supports + - * / ^, sqrt, sin, cos, tan, parentheses, and unary minus.
   * Returns { value, error } where error is a user-friendly string if any.
   */
  try {
    const tokens = tokenize(expr);
    if (tokens.length === 0) return { value: 0, error: '' };
    const rpn = toRPN(tokens);
    const value = evalRPN(rpn, angleMode);
    return { value, error: '' };
  } catch (e) {
    return { value: NaN, error: e.message || 'Invalid Expression' };
  }
}

// PUBLIC_INTERFACE
export function formatNumber(num) {
  /**
   * Format number for display with rounding to reduce floating-point noise.
   */
  if (!isFinite(num)) return '∞';
  const rounded = Math.round(num * 1e12) / 1e12; // 12 decimal places
  return rounded.toString();
}
