import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext'; // Import UserContext if available

const Scorecard = () => {
  const { user } = useContext(UserContext); // Get user from context
  const [scorecards, setScorecards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return; // If no user is logged in, return

    fetch(`/scorecard?user_id=${user.id}`) // Pass user ID as query parameter
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(data => {
        setScorecards(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching scorecards:', error);
        setIsLoading(false);
      });
  }, [user]); // Fetch scorecards when user changes

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Your Scorecards</h1>
      <ul>
        {scorecards.map(scorecard => (
          <li key={scorecard.id}>
            Date: {scorecard.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Scorecard;
