
import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

function Home() {
  const { user } = useContext(UserContext);

  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
      {user && (
        <p>Hello, {user.username}!</p>
      )}
    </div>
  );
}

export default Home;
