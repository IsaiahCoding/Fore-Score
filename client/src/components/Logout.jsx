import React from 'react';

const Logout = ({ user }) => {
  const handleLogout = () => {
    fetch('/logout', {
      method: 'DELETE',
      credentials: 'include', // Include cookies in the request if using sessions
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Assuming the response is a success if it's ok
      alert('Logged out successfully!');
      // You can also redirect the user or perform other actions as needed
    })
    .catch(error => {
      console.error('Error:', error);
      alert('There was an error logging out. Please try again.');
    });
  };

  return (
    <div>
      <h2>Hello, {user.username}</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
