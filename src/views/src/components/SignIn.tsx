import React, { useState } from 'react';
import './SignIn.css';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch('https://apiv2.medleb.org/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const { token, role, donorData, email } = await response.json();
      console.log('Login successful', { token, role, donorData, email });
      localStorage.setItem('token', token); // Store the token

      if (username === 'testuser') {
        navigate('/adminMainPage');
      } else if (username === 'Nizar' || username === 'Psmanager') {
        navigate('/agentMainPage');
      } else {
        navigate('/dashboard'); // Default redirection if username doesn't match
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="signin-wrapper">
      <div className="signin-container">
        <div className="logo">
          <img src="/PSLOGOFINAL.svg" alt="Logo" />
        </div>
        <form className="signin-form" onSubmit={handleSubmit}>
          {error && <p className="error">{error}</p>}
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Sign In</button>
        </form>
        <p className="create-account" onClick={() => navigate('/signup')}>
          Create Account
        </p>
      </div>
    </div>
  );
};

export default SignIn;