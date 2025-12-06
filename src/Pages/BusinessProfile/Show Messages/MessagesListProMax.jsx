// import { useEffect, useState } from 'react';
// // import axios from 'axios';
// import useAxiosfor from '../../../hooks/useAxiosfor';
// import useAuth from '../../../hooks/useAuth';

// const MessagesList = () => {
//     const [messages, setMessages] = useState([]);
//     const axiosfor=useAxiosfor();
//     const { uid, name, email } = useAuth().user;  

//     useEffect(() => {
//         const fetchMessages = async () => {
//             try {
//                 const response = await axiosfor.get('/messages');
//                 setMessages(response.data);
//             } catch (error) {
//                 console.error('Error fetching messages:', error);
//             }
//         };

//         fetchMessages();
//     }, []);

//     return (
//         <div className="p-4">
//             <h2 className="text-2xl font-semibold mb-4">Messages</h2>
//             <div className="space-y-4">
//                 {messages.map((msg) => (
//                     <div key={msg._id} className="flex">
//                         {msg.sender.uid === uid ? (
//                             <div className="flex flex-row-reverse items-start w-full">
//                                 <div className="bg-blue-200 p-4 rounded-lg ml-4">
//                                     <p className="text-sm font-bold">{msg.sender.name}</p>
//                                     <p>{msg.message}</p>
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="flex items-start w-full">
//                                 <div className="bg-green-200 p-4 rounded-lg mr-4">
//                                     <p className="text-sm font-bold">{msg.receiver.name}</p>
//                                     <p>{msg.message}</p>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default MessagesList;
