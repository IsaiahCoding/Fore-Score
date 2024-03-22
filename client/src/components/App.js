import React, {useContext, useEffect}from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './Login';
import Home from './Home';

import Signup from './Signup';
import NavBar from './NavBar';
import Scorecard from './ScorecardForm';
import Logout from './Logout';
import { UserContext } from '../context/UserContext';

function App() {
  const {user, setUser} = useContext(UserContext);

  useEffect(()=>{
    fetch("/check_session").then((response)=>{
      if (response.ok) {
        response.json().then((user)=> setUser(user));
      }
    })
  },[]);

  if (user){
    return (
      <Router>
      
          <NavBar /> 
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/scorecard" component={Scorecard} />
            <Route exact path="/logout" component={Logout} />
            <Route path="/">
              <Home />
            </Route>
          </Switch>
       
      </Router>
    );
  }
}


export default App;
