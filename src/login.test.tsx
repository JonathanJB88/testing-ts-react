import { Login } from './login';
import * as ReactDOM from 'react-dom';
import { LoginService } from './services/LoginService';
import { fireEvent, waitFor } from '@testing-library/react';

describe('Login component tests', () => {
  let container: HTMLDivElement;
  const loginServiceSpy = jest.spyOn(LoginService.prototype, 'login');

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    ReactDOM.render(<Login />, container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container.remove();
  });

  it('renders correctly initial document', () => {
    const inputs = container.querySelectorAll('input');
    expect(inputs).toHaveLength(3);
    expect(inputs[0].name).toBe('login');
    expect(inputs[1].name).toBe('password');
    expect(inputs[2].type).toBe('submit');

    const label = container.querySelector('label');
    expect(label).not.toBeInTheDocument();
  });

  it('renders correctly initial document with data-test query', () => {
    const form = container.querySelector('[data-test="login-form"]');
    expect(form).toBeInTheDocument();
    const inputLogin = container.querySelector('[data-test="login-input"]');
    expect(inputLogin?.getAttribute('name')).toBe('login');
    const inputPassword = container.querySelector(
      '[data-test="password-input"]'
    );
    expect(inputPassword?.getAttribute('name')).toBe('password');
  });

  it('passes credentials correctly', () => {
    const inputs = container.querySelectorAll('input');
    const loginInput = inputs[0];
    const passwordInput = inputs[1];
    const submitButton = inputs[2];

    fireEvent.change(loginInput, { target: { value: 'someUser' } });
    fireEvent.change(passwordInput, { target: { value: 'somePassword' } });
    fireEvent.click(submitButton);

    expect(loginServiceSpy).toHaveBeenCalledWith('someUser', 'somePassword');
  });

  it('renders correctly status label - invalid login', async () => {
    loginServiceSpy.mockResolvedValueOnce(false);
    const inputs = document.querySelectorAll('input');
    const loginButton = inputs[2];
    fireEvent.click(loginButton);
    await waitFor(() =>
      expect(container.querySelector('label')).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(container.querySelector('label')).toHaveTextContent('Login failed')
    );
  });

  it('renders correctly status label - invalid login', async () => {
    loginServiceSpy.mockResolvedValueOnce(true);
    const inputs = document.querySelectorAll('input');
    const loginButton = inputs[2];
    fireEvent.click(loginButton);
    await waitFor(() =>
      expect(container.querySelector('label')).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(container.querySelector('label')).toHaveTextContent(
        'Login successful'
      )
    );
  });
});
