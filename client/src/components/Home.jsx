import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';

function Home() {
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setIsLoading(false); // Set isLoading to false if user is found in local storage
    } else {
      fetch("/check_session").then((response) => {
        if (response.ok) {
          response.json().then((user) => {
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
          });
        }
      }).finally(() => setIsLoading(false)); // Set isLoading to false after fetching
    }
  }, [setUser]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
      {user && (
        <div>
          <p>Hello, {user.username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default Home;
