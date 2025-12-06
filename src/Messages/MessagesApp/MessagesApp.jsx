import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../Context Providers/AuthProvider';
import './MessagesApp.css';


// const MessagesApp = ({ userId }) => {
//     console.log(userId);
//     const { user } = useContext(AuthContext);
//     const uid = user ? user.uid : null;
//     const [state, setState] = useState({
//       messages: [],
//       newMessage: '',
//       receiverId: userId,
//       loading: true,
//       error: '',
//       users: [],
//       drawerOpen: false,
//     });
  
//     useEffect(() => {
//       if (uid) {
//         fetchData();
//       }
//     }, [uid]);
  
//     const fetchData = async () => {
//       setState(prevState => ({ ...prevState, loading: true, error: '' }));
//       try {
//         const [messagesResponse, usersResponse] = await Promise.all([
//           axios.get(`http://localhost:5000/getMessagesForUser/${uid}`),
//           axios.get('http://localhost:5000/users')
//         ]);
//         setState(prevState => ({
//           ...prevState,
//           messages: messagesResponse.data,
//           users: usersResponse.data,
//           loading: false
//         }));
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setState(prevState => ({
//           ...prevState,
//           loading: false,
//           error: 'Failed to load data. Please try again later.'
//         }));
//       }
//     };
  
//     const handleSendMessage = async () => {
//       const { newMessage, receiverId } = state;
//       if (newMessage.trim()) {
//         try {
//           setState(prevState => ({ ...prevState, error: '' }));
//           await axios.post('http://localhost:5000/sendMessage', {
//             senderId: uid,
//             receiverId,
//             content: newMessage.trim()
//           });
//           setState(prevState => ({ ...prevState, newMessage: '' }));
//           fetchData(); // Refresh messages
//         } catch (error) {
//           console.error('Error sending message:', error);
//           setState(prevState => ({
//             ...prevState,
//             error: 'Failed to send message. Please try again later.'
//           }));
//         }
//       } else {
//         setState(prevState => ({ ...prevState, error: 'Message content cannot be empty.' }));
//       }
//     };
  
//     const handleKeyPress = (e) => {
//       if (e.key === 'Enter') {
//         handleSendMessage();
//       }
//     };
  
//     const handleMessageClick = (message) => {
//       setState(prevState => ({
//         ...prevState,
//         receiverId: uid === message.senderId ? message.receiverId : message.senderId,
//         drawerOpen: false,
//       }));
//     };
  
//     const getUserName = (userId) => {
//       const user = state.users.find((u) => u.userId === userId);
//       return user ? user.name : 'Unknown';
//     };
  
//     const toggleDrawer = () => {
//       setState(prevState => ({ ...prevState, drawerOpen: !prevState.drawerOpen }));
//     };
  
//     const { messages, newMessage, loading, error, users, drawerOpen } = state;
  
//     if (!user) {
//       return <div>Please log in to view your messages.</div>;
//     }
  
//     return (
//       <div className="messaging-app">
//         <div className={`drawer ${drawerOpen ? 'open' : ''}`}>
//           <button className="drawer-toggle" onClick={toggleDrawer}>
//             {drawerOpen ? 'Close' : 'Open'} Users
//           </button>
//           <ul className="user-list">
//             {users.map(user => (
//               <li key={user.userId} onClick={() => setState({ ...state, receiverId: user.userId, drawerOpen: false })}>
//                 {user.name}
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className="chat-window">
//           <div className="chat-header">
//             <button className="drawer-toggle" onClick={toggleDrawer}>
//               {drawerOpen ? 'Close' : 'Open'} Users
//             </button>
//             <h1>Messages</h1>
//           </div>
//           <div className="chat-body">
//             {loading ? (
//               <div className="loading">Loading...</div>
//             ) : (
//               <>
//                 {error && <div className="error">{error}</div>}
//                 {messages.length === 0 ? (
//                   <p>No messages found.</p>
//                 ) : (
//                   <ul className="message-list">
//                     {messages.map((message) => (
//                       <li
//                         key={message.messageId}
//                         onClick={() => handleMessageClick(message)}
//                         className={`message-item ${message.senderId === uid ? 'sent' : 'received'}`}
//                       >
//                         <div className="message-content">
//                           <div className="message-user"><strong>{getUserName(message.senderId)}</strong></div>
//                           <div className="message-text">{message.content}</div>
//                           <div className="message-timestamp">{new Date(message.timestamp).toLocaleString()}</div>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </>
//             )}
//           </div>
//           <div className="chat-footer">
//             <input
//               type="text"
//               placeholder="Type a message"
//               value={newMessage}
//               onChange={(e) => setState({ ...state, newMessage: e.target.value })}
//               onKeyPress={handleKeyPress}
//               className="message-input"
//             />
//             <button
//               onClick={handleSendMessage}
//               className="send-button"
//             >
//               Send
//             </button>
//           </div>
//         </div>
//         {/* <style jsx>{`
          
//         `}</style> */}
//       </div>
//     );
//   };

// const MessagesApp = ({ userId }) => {
//   console.log(userId);
//   const { user } = useContext(AuthContext);
//   const uid = user ? user.uid : null;

//   const [state, setState] = useState({
//     messages: [],
//     newMessage: '',
//     receiverId: userId,
//     loading: true,
//     error: '',
//     users: [],
//     drawerOpen: false,
//   });

//   useEffect(() => {
//     if (uid) {
//       fetchData();
//     }
//   }, [uid]);

//   useEffect(() => {
//     setState(prevState => ({
//       ...prevState,
//       receiverId: userId,
//     }));
//   }, [userId]);

//   const fetchData = async () => {
//     setState(prevState => ({ ...prevState, loading: true, error: '' }));
//     try {
//       const [messagesResponse, usersResponse] = await Promise.all([
//         axios.get(`http://localhost:5000/getMessagesForUser/${uid}`),
//         axios.get('http://localhost:5000/users')
//       ]);
//       setState(prevState => ({
//         ...prevState,
//         messages: messagesResponse.data,
//         users: usersResponse.data,
//         loading: false
//       }));
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setState(prevState => ({
//         ...prevState,
//         loading: false,
//         error: 'Failed to load data. Please try again later.'
//       }));
//     }
//   };

//   const handleSendMessage = async () => {
//     const { newMessage, receiverId } = state;
//     if (newMessage.trim()) {
//       try {
//         setState(prevState => ({ ...prevState, error: '' }));
//         await axios.post('http://localhost:5000/sendMessage', {
//           senderId: uid,
//           receiverId,
//           content: newMessage.trim()
//         });
//         setState(prevState => ({ ...prevState, newMessage: '' }));
//         fetchData(); // Refresh messages
//       } catch (error) {
//         console.error('Error sending message:', error);
//         setState(prevState => ({
//           ...prevState,
//           error: 'Failed to send message. Please try again later.'
//         }));
//       }
//     } else {
//       setState(prevState => ({ ...prevState, error: 'Message content cannot be empty.' }));
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSendMessage();
//     }
//   };

//   const handleMessageClick = (message) => {
//     setState(prevState => ({
//       ...prevState,
//       receiverId: uid === message.senderId ? message.receiverId : message.senderId,
//       drawerOpen: false,
//     }));
//   };

//   const getUserName = (userId) => {
//     const user = state.users.find((u) => u.userId === userId);
//     return user ? user.name : 'Unknown';
//   };

//   const toggleDrawer = () => {
//     setState(prevState => ({ ...prevState, drawerOpen: !prevState.drawerOpen }));
//   };

//   const { messages, newMessage, loading, error, users, drawerOpen } = state;

//   if (!user) {
//     return <div>Please log in to view your messages.</div>;
//   }

//   return (
//     <div className="messaging-app">
//       <div className={`drawer ${drawerOpen ? 'open' : ''}`}>
//         <button className="drawer-toggle" onClick={toggleDrawer}>
//           {drawerOpen ? 'Close' : 'Open'} Users
//         </button>
//         <ul className="user-list">
//           {users.map(user => (
//             <li key={user.userId} onClick={() => setState({ ...state, receiverId: user.userId, drawerOpen: false })}>
//               {user.name}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="chat-window">
//         <div className="chat-header">
//           <button className="drawer-toggle" onClick={toggleDrawer}>
//             {drawerOpen ? 'Close' : 'Open'} Users
//           </button>
//           <h1>Messages</h1>
//         </div>
//         <div className="chat-body">
//           {loading ? (
//             <div className="loading">Loading...</div>
//           ) : (
//             <>
//               {error && <div className="error">{error}</div>}
//               {messages.length === 0 ? (
//                 <p>No messages found.</p>
//               ) : (
//                 <ul className="message-list">
//                   {messages.map((message) => (
//                     <li
//                       key={message.messageId}
//                       onClick={() => handleMessageClick(message)}
//                       className={`message-item ${message.senderId === uid ? 'sent' : 'received'}`}
//                     >
//                       <div className="message-content">
//                         <div className="message-user"><strong>{getUserName(message.senderId)}</strong></div>
//                         <div className="message-text">{message.content}</div>
//                         <div className="message-timestamp">{new Date(message.timestamp).toLocaleString()}</div>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </>
//           )}
//         </div>
//         <div className="chat-footer">
//           <input
//             type="text"
//             placeholder="Type a message"
//             value={newMessage}
//             onChange={(e) => setState({ ...state, newMessage: e.target.value })}
//             onKeyPress={handleKeyPress}
//             className="message-input"
//           />
//           <button
//             onClick={handleSendMessage}
//             className="send-button"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//       {/* <style jsx>{`
        
//       `}</style> */}
//     </div>
//   );
// };

const MessagesApp = ({ userId }) => {
    console.log(userId);
    const { user } = useContext(AuthContext);
    const uid = user ? user.uid : null;
  
    const [state, setState] = useState({
      messages: [],
      newMessage: '',
      receiverId: userId,
      loading: true,
      error: '',
      users: [],
      drawerOpen: false,
    });
  
    useEffect(() => {
      if (uid) {
        fetchData();
      }
    }, [uid]);
  
    useEffect(() => {
      setState(prevState => ({
        ...prevState,
        receiverId: userId,
      }));
    }, [userId]);
  
    const fetchData = async () => {
      setState(prevState => ({ ...prevState, loading: true, error: '' }));
      try {
        const [messagesResponse, usersResponse] = await Promise.all([
          axios.get(`http://localhost:5000/getMessagesForUser/${uid}`),
          axios.get('http://localhost:5000/users')
        ]);
        setState(prevState => ({
          ...prevState,
          messages: messagesResponse.data,
          users: usersResponse.data,
          loading: false
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
        setState(prevState => ({
          ...prevState,
          loading: false,
          error: 'Failed to load data. Please try again later.'
        }));
      }
    };
  
    const handleSendMessage = async () => {
      const { newMessage, receiverId } = state;
      if (newMessage.trim()) {
        try {
          setState(prevState => ({ ...prevState, error: '' }));
          await axios.post('http://localhost:5000/sendMessage', {
            senderId: uid,
            receiverId,
            content: newMessage.trim()
          });
          setState(prevState => ({ ...prevState, newMessage: '' }));
          fetchData(); // Refresh messages
        } catch (error) {
          console.error('Error sending message:', error);
          setState(prevState => ({
            ...prevState,
            error: 'Failed to send message. Please try again later.'
          }));
        }
      } else {
        setState(prevState => ({ ...prevState, error: 'Message content cannot be empty.' }));
      }
    };
  
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    };
  
    const handleMessageClick = (message) => {
      setState(prevState => ({
        ...prevState,
        receiverId: uid === message.senderId ? message.receiverId : message.senderId,
        drawerOpen: false,
      }));
    };
  
    const getUserName = (userId) => {
      const user = state.users.find((u) => u.userId === userId);
      return user ? user.name : 'Unknown';
    };
  
    const toggleDrawer = () => {
      setState(prevState => ({ ...prevState, drawerOpen: !prevState.drawerOpen }));
    };
  
    const { messages, newMessage, loading, error, users, drawerOpen } = state;
  
    if (!user) {
      return <div>Please log in to view your messages.</div>;
    }
  
    return (
      <div className="messaging-app">
        <div className={`drawer ${drawerOpen ? 'open' : ''}`}>
          <button className="drawer-toggle" onClick={toggleDrawer}>
            {drawerOpen ? 'Close' : 'Open'} Users
          </button>
          <ul className="user-list">
            {users.map(user => (
              <li key={user.userId} onClick={() => setState({ ...state, receiverId: user.userId, drawerOpen: false })}>
                {user.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="chat-window">
          <div className="chat-header">
            <button className="drawer-toggle" onClick={toggleDrawer}>
              {drawerOpen ? 'Close' : 'Open'} Users
            </button>
            <h1>Messages</h1>
          </div>
          <div className="chat-body">
            {loading ? (
              <div className="loading">Loading...</div>
            ) : (
              <>
                {error && <div className="error">{error}</div>}
                {messages.length === 0 ? (
                  <p>No messages found.</p>
                ) : (
                  <ul className="message-list">
                    {messages.map((message) => (
                      <li
                        key={message.messageId}
                        onClick={() => handleMessageClick(message)}
                        className={`message-item ${message.senderId === uid ? 'sent' : 'received'}`}
                      >
                        <div className="message-content">
                          <div className="message-user"><strong>{getUserName(message.senderId)}</strong></div>
                          <div className="message-text">{message.content}</div>
                          <div className="message-timestamp">{new Date(message.timestamp).toLocaleString()}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              placeholder="Type a message"
              value={newMessage}
              onChange={(e) => setState({ ...state, newMessage: e.target.value })}
              onKeyPress={handleKeyPress}
              className="message-input"
            />
            <button
              onClick={handleSendMessage}
              className="send-button"
            >
              Send
            </button>
          </div>
        </div>
        {/* <style jsx>{`
          
        `}</style> */}
      </div>
    );
  };
  

export default MessagesApp;