import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../Context Providers/AuthProvider';
import useAuth from '../../hooks/useAuth';
import './MessagingApp.css';
import LoadingSpinner from '../../Shared Components/Spinner/LoadingSpinner';

const MessagingApp = () => {
  const { user: currentUser } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [contacts, setContacts] = useState([]);

  // Retrieve selectedContact from localStorage and parse it safely
  const getInitialSelectedContact = () => {
    const storedContact = localStorage.getItem('selectedContact');
    return storedContact && storedContact !== 'undefined' ? JSON.parse(storedContact) : null;
  };

  const [selectedContact, setSelectedContact] = useState(getInitialSelectedContact());

  useEffect(() => {
    if (!currentUser) return;

    const fetchMessagesAndContacts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/getMessagesForUser/${currentUser.uid}`);
        const userMessages = response.data;
        setMessages(userMessages);

        const uniqueContacts = Array.from(
          new Set(
            userMessages.flatMap(msg => [msg.senderId, msg.receiverId])
              .filter(contactId => contactId !== currentUser.uid)
          )
        );

        const contactsDetails = await Promise.all(uniqueContacts.map(async contactId => {
          const contactResponse = await axios.get(`http://localhost:5000/users/${contactId}`);
          return contactResponse.data;
        }));

        setContacts(contactsDetails);

        if (selectedContact) {
          handleContactSelect(selectedContact);
        }
      } catch (error) {
        setError('Error fetching messages');
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessagesAndContacts();
  }, [currentUser]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleString();
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;

    const message = {
      senderId: currentUser.uid,
      receiverId: selectedContact.userId,
      content: newMessage,
      timestamp: new Date()
    };

    try {
      const response = await axios.post('http://localhost:5000/sendMessage', message);
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage('');
    } catch (error) {
      setError('Error sending message');
      console.error('Error sending message:', error);
    }
  };

  const handleContactSelect = async (contact) => {
    if (!contact) {
      console.error('Selected contact is undefined');
      return;
    }

    setSelectedContact(contact);
    localStorage.setItem('selectedContact', JSON.stringify(contact));
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:5000/getMessagesBetweenUsers`, {
        params: {
          userId1: currentUser.uid,
          userId2: contact.userId
        }
      });
      setMessages(response.data);
    } catch (error) {
      setError('Error fetching messages for the selected contact');
      console.error('Error fetching messages for the selected contact:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredMessages = () => {
    return messages.filter(msg =>
      (msg.senderId === currentUser.uid && msg.receiverId === selectedContact?.userId) ||
      (msg.senderId === selectedContact?.userId && msg.receiverId === currentUser.uid)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        {/* <div className="loader">Loading...</div> */}
        <LoadingSpinner></LoadingSpinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Messages</h2>
      <div className="mb-4">
        <label htmlFor="contacts" className="block text-sm font-medium text-gray-700">Select Contact:</label>
        <select
          id="contacts"
          className="mt-1 block w-full p-2 border rounded-lg"
          value={selectedContact?.userId || ''}
          onChange={(e) => {
            const contact = contacts.find(contact => contact.userId === e.target.value);
            if (contact) {
              handleContactSelect(contact);
            } else {
              console.error('Selected contact not found in contacts list');
            }
          }}
        >
          <option value="">Select a contact</option>
          {contacts.map(contact => (
            <option key={contact.userId} value={contact.userId}>
              {contact.name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-4 overflow-y-auto max-h-96">
        {getFilteredMessages().map((msg) => (
          <div key={msg._id} className={`flex ${msg.senderId === currentUser.uid ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-lg ${msg.senderId === currentUser.uid ? 'bg-blue-200 text-right' : 'bg-green-200 text-left'}`}>
              <p className="text-sm font-bold">
                {msg.senderId === currentUser.uid ? 'You' : selectedContact.name}
              </p>
              <p>{msg.content}</p>
              <p className="text-xs text-gray-500">{formatDate(msg.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          className="flex-grow p-2 border rounded-lg"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Send
        </button>
      </div>
    </div>
  );
};



export default MessagingApp;
