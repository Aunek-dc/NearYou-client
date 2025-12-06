import React, { useEffect, useRef } from 'react';

const ChatBody = ({ loading, error, messages, uid, handleMessageClick, getUserName }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const groupMessagesByDate = (messages) => {
    const grouped = messages.reduce((acc, message) => {
      const date = new Date(message.timestamp).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(message);
      return acc;
    }, {});

    return Object.keys(grouped).map((date) => ({
      date,
      messages: grouped[date],
    }));
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="chat-body">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div>
          {error && <div className="error">{error}</div>}
          {messages.length === 0 ? (
            <p>No messages found.</p>
          ) : (
            <ul className="message-list">
              {groupedMessages.map((group) => (
                <div key={group.date}>
                  <div className="message-date">{group.date}</div>
                  {group.messages.map((message) => (
                    <li
                      key={message.messageId}
                      onClick={() => handleMessageClick(message)}
                      className={`message-item ${message.senderId === uid ? 'sent' : 'received'}`}
                    >
                      <div className="message-content">
                        <div className="message-user">
                          <strong>{getUserName(message.senderId)}</strong>
                        </div>
                        <div className="message-text">{message.content}</div>
                        <div className="message-timestamp">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </li>
                  ))}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBody;
