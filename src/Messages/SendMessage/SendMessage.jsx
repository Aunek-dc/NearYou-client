// src/components/SendMessage.js
import { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../Context Providers/AuthProvider';
import useAxiosfor from '../../hooks/useAxiosfor';

// const SendMessage = ({ user, product, onMessageSent }) => {
//     // console.log(user.displayName);
//     const [message, setMessage] = useState("");
//     const [error, setError] = useState(null);

//     const handleSendMessage = async () => {
//         const { uid, displayName, email } = user;
//         const { userId, email: receiverEmail, id: productId } = product;

//         try {
//             const response = await axios.post('http://localhost:5000/sendMessage', {
//                 uid,
//                 name:displayName,
//                 email,
//                 receiverId: userId,
//                 receiverEmail,
//                 productId,
//                 message
//             });
//             console.log(response.data.message);
//             onMessageSent(response.data.message); // Pass the new message to the parent component
//             setMessage(""); // Clear the message input field
//         } catch (error) {
//             setError('Error sending message');
//             console.error('Error sending message:', error.response ? error.response.data : error.message);
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-80">
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-xl font-semibold">Message for {product.product_name || product.name}</h2>
//                     <button onClick={() => onMessageSent(null)} className="text-gray-500 hover:text-gray-700 transition duration-300">
//                         &times;
//                     </button>
//                 </div>
//                 <textarea
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     rows="4"
//                     className="w-full border border-gray-300 p-2 rounded-lg"
//                     placeholder="Type your message here..."
//                 />
//                 {error && <p className="text-red-500 mt-2">{error}</p>}
//                 <div className="flex justify-end mt-4">
//                     <button
//                         onClick={handleSendMessage}
//                         className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
//                     >
//                         Send
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

const SendMessage = ({ product, onMessageSent }) => {
    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);
    const axiosFor = useAxiosfor();
    const [receiverEmail, setReceiverEmail] = useState("");
    console.log(receiverEmail);

    const handleSendMessage = async () => {
        const { uid, displayName, email } = user;
        const { userId, id: productId } = product;

        try {
            // Retrieve receiver email
            const response = await axiosFor.get('/users');
            const mail = response.data.find(item => item.userId === product.userId);

            if (!mail) {
                setError("Error getting email of the receiver or not found");
                return;
            }

            setReceiverEmail(mail.email);

            // Send the message
            const sendMessageResponse = await axios.post('http://localhost:5000/sendMessage', {
                uid,
                name: displayName,
                email,
                receiverId: userId,
                receiverEmail: mail.email,
                productId,
                message
            });

            onMessageSent(sendMessageResponse.data.message);
            setMessage("");
        } catch (error) {
            setError('Error sending message');
            console.error('Error sending message:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Message for {product.product_name || product.name}</h2>
                    <button onClick={() => onMessageSent(null)} className="text-gray-500 hover:text-gray-700 transition duration-300">
                        &times;
                    </button>
                </div>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="4"
                    className="w-full border border-gray-300 p-2 rounded-lg"
                    placeholder="Type your message here..."
                />
                {error && <p className="text-red-500 mt-2">{error}</p>}
                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleSendMessage}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SendMessage;
