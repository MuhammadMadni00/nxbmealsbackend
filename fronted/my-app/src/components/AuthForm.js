import React, { useState } from 'react';
import axios from 'axios';
// /home/muhammadmadni/node-login-app/fronted/my-app/src/AuthForm.css
// import '../components/'; // Add your CSS file

const AuthForm = ({ type }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (type === 'login') {
        await axios.post('/api/auth/login', formData);
        alert('Logged in successfully');
      } else if (type === 'signup') {
        await axios.post('/api/auth/signup', formData);
        alert('Signed up successfully');
      }
    } catch (error) {
      console.error(error);
      alert('Error');
    }
  };

  return (
    <div className="auth-form">
      <h2>{type === 'login' ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        {type === 'signup' && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">{type === 'login' ? 'Login' : 'Sign Up'}</button>
      </form>
      {type === 'login' && (
        <p>
          <a href="/forgot-password">Forgot Password?</a>
        </p>
      )}
    </div>
  );
};

export default AuthForm;
