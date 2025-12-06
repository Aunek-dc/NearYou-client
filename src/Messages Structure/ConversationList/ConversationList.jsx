import React from 'react';

const ConversationList = ({ users, currentUserId, onConversationSelect, getUserName }) => (
  <div className="conversation-list">
    <h2>Conversations</h2>
    <ul>
      {users.map((user) => (
        <li
          key={user.userId}
          className={`conversation-item ${user.userId === currentUserId ? 'active' : ''}`}
          onClick={() => onConversationSelect(user.userId)}
        >
          {getUserName(user.userId)}
        </li>
      ))}
    </ul>
  </div>
);

export default ConversationList;
