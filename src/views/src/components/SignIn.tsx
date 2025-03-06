import React, { useState } from 'react';
import './SignIn.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const SignIn: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    try {
      const response = await axios.post('https://apiv2.medleb.org/users/login', {
        username,
        password,
      });
  
      const { token, role, donorData, email } = response.data;
      console.log('Login successful', { token, role, donorData, email });
  
      localStorage.setItem('token', token);
  
      if (username === 'testuser') {
        navigate('/adminMainPage');
      } else if (username === 'Nizar' || username === 'Psmanager') {
        navigate('/agentMainPage');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error.response?.data?.error || error.message);
      setError(error.response?.data?.error || 'Login failed');
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