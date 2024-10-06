import React from 'react';
import './ActiveUsersList.css'

function ActiveUsersList({ activeUsers, onClose }) {

  return (
    <div className="ActiveUsersList">
      <button className="close-button" onClick={onClose}>&#10006;</button>
      <h3>Активные пользователи</h3>
      <ul>
        {activeUsers.map((user, index) => (
          <li key={index}>
            <img src={user.photoURL} alt="Avatar" className="avatar" />
            <span className="username">{user.displayName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActiveUsersList;
