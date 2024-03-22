import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Signup from './Signup';
import NavBar from './NavBar';
import Scorecard from './ScorecardForm';
import Logout from './Logout';
import { UserContext } from '../context/UserContext';

function App() {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    fetch("/check_session", {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('authToken')}` // Assuming you're using tokens for session management
      },
    })
    .then((response) => {
      if (response.ok) {
        response.json().then((user) => setUser(user));
      } else {
        setUser(null); // Ensure user state is cleared if session check fails
      }
    })
    .catch((error) => {
      console.error("Session check failed:", error);
      setUser(null);
    });
  }, [setUser]);

  return (
    <Router>
      <NavBar /> 
      <Switch>
        {/* Redirect to login if not authenticated */}
        <Route path="/login">
          {user ? <Redirect to="/home" /> : <Login />}
        </Route>
        <Route path="/signup">
          {user ? <Redirect to="/home" /> : <Signup />}
        </Route>
        {/* Protected routes */}
        {user ? (
          <>
            <Route exact path="/home" component={Home} />
            <Route exact path="/scorecard" component={Scorecard} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
          </>
        ) : (
          <Redirect to="/login" />
        )}
      </Switch>
    </Router>
  );
}

export default App;
