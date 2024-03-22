import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function Logout() {
  const { setUser } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    fetch('/logout', { method: 'DELETE' })
    .then(() => {
      setUser(null);
      history.push('/login');
    });
  }, [setUser, history]);

  return null; // This component doesn't need to render anything.
}
export default Logout;
