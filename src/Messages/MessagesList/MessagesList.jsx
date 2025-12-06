// src/components/MessagesList.js
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../Context Providers/AuthProvider';

// const MessagesList = ({ product }) => {
//     const [messages, setMessages] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const {user}=useContext(AuthContext);

//     useEffect(() => {
//         const fetchMessages = async () => {
//             try {
//                 const response = await axios.get('http://localhost:5000/messages');
//                 const userMessages = response.data.filter(
//                     (msg) =>
//                         (msg.sender.uid === user.uid || msg.receiver.uid === user.uid)
//                         // msg.product.id === product.id
//                 );
//                 setMessages(userMessages);
//             } catch (error) {
//                 setError('Error fetching messages');
//                 console.error('Error fetching messages:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchMessages();
//     }, [user, product]);

//     const formatDate = (dateString) => {
//         try {
//             const date = new Date(dateString);
//             return date.toLocaleString();
//         } catch (error) {
//             console.error('Error formatting date:', error);
//             return 'Invalid date';
//         }
//     };

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-full">
//                 <div className="loader">...</div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="flex justify-center items-center h-full">
//                 <p className="text-red-500">{error}</p>
//             </div>
//         );
//     }

//     return (
//         <div className="p-4 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
//             <h2 className="text-2xl font-semibold mb-4">Messages</h2>
//             <div className="space-y-4 overflow-y-auto max-h-96">
//                 {messages.map((msg) => (
//                     <div key={msg._id} className={`flex ${msg.sender.uid === user.uid ? 'justify-end' : 'justify-start'}`}>
//                         <div className={`p-4 rounded-lg ${msg.sender.uid === user.uid ? 'bg-blue-200 text-right' : 'bg-green-200 text-left'}`}>
//                             <p className="text-sm font-bold">{msg.sender.uid === user.uid ? msg.sender.name : msg.receiver.name}</p>
//                             <p>{msg.message}</p>
//                             <p className="text-xs text-gray-500">{formatDate(msg.timestamp)}</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

const MessagesList = ({ product, setMessages }) => {
    const [messages, setMessagesState] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);
    // console.log(user);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get('http://localhost:5000/messages');
                const userMessages = response.data.filter(
                    (msg) =>
                        (msg.sender.uid === user.uid || msg.receiver.uid === user.uid) &&
                        msg.product?.productId === product?.id
                );
                setMessagesState(userMessages);
                setMessages(userMessages); // Pass messages to parent component
            } catch (error) {
                setError('Error fetching messages');
                console.error('Error fetching messages:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [user, product, setMessages]);

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString();
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid date';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="loader">Loading...</div>
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
            <div className="space-y-4 overflow-y-auto max-h-96">
                {messages.map((msg) => (
                    <div key={msg._id} className={`flex ${msg.sender.uid === user.uid ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-4 rounded-lg ${msg.sender.uid === user.uid ? 'bg-blue-200 text-right' : 'bg-green-200 text-left'}`}>
                            <p className="text-sm font-bold">{msg.sender.uid === user.uid ? 'You' : msg.sender.name}</p>
                            <p>{msg.message}</p>
                            <p className="text-xs text-gray-500">{formatDate(msg.timestamp)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};



export default MessagesList;
