import React from 'react';
import { Link } from 'react-router-dom';

const WelcomeForm = () => {
  return (
    <div>
      <h2>Welcome to Fore Score</h2>
      <p>Please sign in or sign up to continue.</p>
      <div>
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/signup">
          <button>Signup</button>
        </Link>
      </div>
    </div>
  );
};

export default WelcomeForm;
