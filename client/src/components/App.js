import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import { UserProvider } from '../context/UserContext'; // Assuming you have a UserContext provider



function App() {
  
  return (
    <Router>
      <UserProvider>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/home" component={Home} />
        </Switch>
      </UserProvider>
    </Router>
  );
}

export default App;
