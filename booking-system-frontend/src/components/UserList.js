import React from 'react';
import '../styles/UserList.css';

const UserList = ({ users }) => {
  return (
    <div className="user-list">
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        users.map((user) => (
          <div key={user.id} className="user-item">
            <p><strong>{user.name}</strong></p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default UserList;
