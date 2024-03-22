import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; 
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

function SignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const history = useHistory();
  const { setUser } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/signup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
      if (data.user) {
        setUser(data.user);
        history.push('/home');
      }
    })
    .catch(error => console.error('Error:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
      </label>
      <label>
        Username:
        <input type="text" name="username" value={formData.username} onChange={handleChange} />
      </label>
      <label>
        Email:
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
      </label>
      <label>
        Password:
        <input type="password" name="password" value={formData.password} onChange={handleChange} />
      </label>
      <button type="submit">Signup</button>
    </form>
  );
};

export default SignupForm;