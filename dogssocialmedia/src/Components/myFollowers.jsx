import React from 'react';
import './MyFollowers.css';

const MyFollowers = ({ loggedInUser, followers }) => {
  return (
    <div className="my-followers-container">
      <div className="current-user">{loggedInUser}</div>
      <ul className="followers-list">
        {followers.map((follower, index) => (
          <li key={index}>{follower}</li>
        ))}
      </ul>
    </div>
  );
};

export default MyFollowers;
