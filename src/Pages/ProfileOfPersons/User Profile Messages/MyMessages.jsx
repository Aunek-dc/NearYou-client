import { useState } from 'react';
import useAxiosfor from '../../../hooks/useAxiosfor';
import useAuth from '../../../hooks/useAuth';

const MyMessages = ({ product, onClose }) => {
    const [message, setMessage] = useState("");
    const { uid, name, email } = useAuth().user;  // Assuming authUser contains these details
    const { userId, email: receiverEmail, id: productId } = product;
    const axiosfor=useAxiosfor();

    const handleSendMessage = async () => {
        try {
            const response = await axiosfor.post('/sendMessage', {
                uid,
                name,
                email,
                receiverId: userId,
                receiverEmail,
                productId,
                message
            });
            console.log(response.data.message);
            onClose();
        } catch (error) {
            console.error('Error sending message:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Message for {product.product_name || product.name}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition duration-300">
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


// const MyMessages = ({ product, onClose }) => {
//     const [message, setMessage] = useState("");

//     const handleSendMessage = () => {
//         // Handle sending the message (e.g., API call)
//         console.log(`Message to ${product.product_name || product.name}: ${message}`);
//         onClose();
//     };

//     return (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-80">
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-xl font-semibold">Message for {product.product_name || product.name}</h2>
//                     <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition duration-300">
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

export default MyMessages;