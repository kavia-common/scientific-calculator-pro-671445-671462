import { render, screen } from '@testing-library/react';
import App from './App';

test('renders calculator', () => {
  render(<App />);
  const modeToggle = screen.getByRole('button', { name: /toggle angle mode/i });
  expect(modeToggle).toBeInTheDocument();
});
