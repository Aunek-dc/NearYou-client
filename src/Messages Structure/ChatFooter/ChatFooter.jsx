import React from 'react';

const ChatFooter = ({ newMessage, setNewMessage, handleSendMessage, handleKeyPress }) => (
  <div className="chat-footer">
    <input
      type="text"
      placeholder="Type a message"
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      onKeyPress={handleKeyPress}
      className="message-input"
    />
    <button onClick={handleSendMessage} className="send-button">
      Send
    </button>
  </div>
);

export default ChatFooter;
