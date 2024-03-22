import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function Login() {
  const history = useHistory();
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Login failed'); // You can enhance error handling by using response data
      }
      return response.json();
    })
    .then(data => {
      // Assuming the backend response includes user data on successful login
      setUser(data); // Update user context
      history.push('/home'); // Redirect to home page
    })
    .catch(error => {
      console.error('Error:', error);
      setError('Failed to log in. Please check your credentials.'); // Update error message to display to the user
    });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default Login;
