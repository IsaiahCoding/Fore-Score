import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import { UserProvider } from '../context/UserContext';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    } else {
      fetch("/check_session").then((response) => {
        if (response.ok) {
          response.json().then((user) => {
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user)); // Store user in local storage
          });
        }
      });
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Store user in local storage
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Remove user from local storage
  };

  return (
    <Router>
      <UserProvider>
        <Switch>
          <Route exact path="/login">
            <Login onLogin={handleLogin} />
          </Route>
          <Route exact path="/home">
            <Home user={user} onLogout={handleLogout} />
          </Route>
        </Switch>
      </UserProvider>
    </Router>
  );
}

export default App;
