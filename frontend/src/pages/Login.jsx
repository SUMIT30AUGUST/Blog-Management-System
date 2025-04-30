import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../api/apiConfig';
import '../styles/Login.css'; 


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(API.LOGIN, { email, password });
        localStorage.setItem('token',response.data.data.token);
        navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Email or Password Incorrect');
    }
  };

  return (
<div className="login-form-container">
    <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      <p className="redirect-link">Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
};

export default Login;
