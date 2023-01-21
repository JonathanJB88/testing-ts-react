import { render } from '@testing-library/react';
import App from './App';

it('renders properly', () => {
  const { getByText } = render(<App />);
  const textOnScreen = getByText(/login/i);
  expect(textOnScreen).toBeInTheDocument();
});
