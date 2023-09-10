import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:5000/api/users/login', {  
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to login');
        }
      })
      .then(data => {
        const { token } = data;
        if (data.isAdmin) {
          localStorage.setItem('isAdmin', true);
        } else {
          localStorage.setItem('isAdmin', false);
        }

        const expirationTime = rememberMe ? 10 * 24 * 60 * 60 * 1000 : 30 * 60 * 1000;
        const expirationDate = new Date(new Date().getTime() + expirationTime);

        document.cookie = `authToken=${token}; expires=${expirationDate.toUTCString()}`;

        navigate('/FeedPage');
      })
      .catch(error => {
        console.error('Error:', error);
        setErrorMsg('Login failed. Please try again.');
      });
  };

  return (
    <div className="login-container">
      {errorMsg && <p className="error-message">{errorMsg}</p>} 
      <h1 className="welcome-header">Welcome to PawsBook</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input 
            type="password" 
            placeholder="Enter your password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div className="remember-me">
          <input 
            type="checkbox" 
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <label>Remember me</label>
        </div>
        <button type="submit">Login</button>
        <p className="register-prompt">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </form>
    </div>
  );
};  

export default Login;
