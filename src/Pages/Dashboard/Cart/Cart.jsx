// import React from 'react';
import { useContext, useEffect, useState } from 'react';
import useCart from '../../../hooks/useCart';
import useAxiosfor from '../../../hooks/useAxiosfor';
import { Helmet } from 'react-helmet-async';
// import MyMessages from "../../ProfileOfPersons/User Profile Messages/MyMessages";
import MessagesApp from '../../../Messages/MessagesApp/MessagesApp';
import { AuthContext } from '../../../Context Providers/AuthProvider';
// import MessagingApp from '../../../Messages2/MessagingApp/MessagingApp';
import { Drawer, Button } from '@mui/material';
import Invoice from './InvoiceForm/Invoice';

const Cart = () => {
    const [cart, refetch] = useCart();
    // console.log(cart);
    const { user } = useContext(AuthContext);
    const axiosFor = useAxiosfor();
    const [lateCart, setLateCart] = useState([]);
    const [deletedId, setDeletedId] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [purchaseQuantities, setPurchaseQuantities] = useState({});
    const [clearCartVisible, setClearCartVisible] = useState(false);
    const [showMessenger, setShowMessenger] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handlePayment = (mail, name) => {
        // console.log(mail, name, totalPrice, purchaseQuantities[cart[0]._id]);
    }

    const toggleDrawer = (open) => (event) => {
        handlePayment(user.email, user.displayName);
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsDrawerOpen(open);
    };

    useEffect(() => {
        setLateCart(cart.filter(item => !item.isDeleted));
        setDeletedId(cart.filter(item => item.isDeleted).map(item => item._id));

        const initialQuantities = {};
        cart.forEach(item => {
            initialQuantities[item._id] = item.purchaseQuantity || 1;
        });
        setPurchaseQuantities(initialQuantities);
    }, [cart]);

    useEffect(() => {
        setTotalPrice(
            lateCart.reduce((sum, item) => sum + (item.price * (purchaseQuantities[item._id] || 1)), 0));
        setTotalItems(lateCart.reduce((sum, item) => (sum + (purchaseQuantities[item._id]) || 1), 0));

        // Show clear cart button only if all items are deleted
        setClearCartVisible(deletedId.length > 0 && deletedId.length === cart.length);
    }, [lateCart, purchaseQuantities, deletedId, cart.length]);

    const handleBack = (productId) => {
        const updatedDeletedId = deletedId.filter(dId => productId !== dId);
        setDeletedId(updatedDeletedId);

        const restoredProduct = cart.find(prod => prod._id === productId);
        if (restoredProduct) {
            setLateCart([...lateCart, restoredProduct]);
        }

        axiosFor.put(`/cart/${productId}/getback`, restoredProduct)
            .then(res => {
                if (res.data.modifiedCount) {
                    refetch();
                }
            });
    };

    const handleDelete = (productId) => {
        setDeletedId([...deletedId, productId]);
        setLateCart(lateCart.filter(oneItem => oneItem._id !== productId));

        const deletedProduct = cart.find(item => item._id === productId);
        axiosFor.put(`/cart/${productId}/delete`, deletedProduct)
            .then(res => {
                if (res.data.modifiedCount) {
                    refetch();
                }
            });
    };

    const handleDeleteAll = (del) => {
        const ans = confirm("Do you want to proceed?");
        if (ans) {
            del.map(delId => {
                axiosFor.delete(`/cart/${delId}`)
                    .then(res => {
                        console.log(res);
                        refetch();
                    });
            });
        }
    };

    const handleClearCart = () => {
        handleDeleteAll(deletedId);
    };

    const handleIncrement = (productId) => {
        const newPurchaseQuantities = { ...purchaseQuantities, [productId]: (purchaseQuantities[productId] || 1) + 1 };
        setPurchaseQuantities(newPurchaseQuantities);
        axiosFor.put(`/cart/${productId}/update-quantity`, { quantity: newPurchaseQuantities[productId] })
            .then(res => {
                console.log(res.data);
            });
    };

    const handleDecrement = (productId) => {
        if (purchaseQuantities[productId] > 1) {
            const newPurchaseQuantities = { ...purchaseQuantities, [productId]: purchaseQuantities[productId] - 1 };
            setPurchaseQuantities(newPurchaseQuantities);
            axiosFor.put(`/cart/${productId}/update-quantity`, { quantity: newPurchaseQuantities[productId] })
                .then(res => {
                    console.log(res.data);
                });
        }
    };

    const handleSendMessage = (product) => {
        setCurrentProduct(product);
        setShowMessenger(true);
    };

    const handleCloseMessenger = () => {
        setShowMessenger(false);
        setCurrentProduct(null);
    };

    return (
        <div className="container mx-auto p-4 pt-0">
            <Helmet>
                <title>My Cart</title>
            </Helmet>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-0">
                <div className="bg-white p-6 rounded-lg shadow-lg col-span-1">
                    <h2 className="text-2xl font-semibold mb-4 text-center">Order Summary</h2>
                    <div className="border-t border-gray-200 py-4">
                        <div className="flex justify-between text-lg">
                            <span>Items:</span>
                            <span>{totalItems}</span>
                        </div>
                        <div className="flex justify-between text-lg mt-2">
                            <span>Total Price:</span>
                            <span> {totalPrice.toFixed(4)}</span>
                        </div>
                    </div>
                    {lateCart.length > 0 && (
                        <button
                            // onClick={() => handleDeleteAll(deletedId)}
                            onClick={toggleDrawer(true)} //
                            className="w-full bg-blue-500 text-white font-semibold py-2 mt-4 rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            Pay
                        </button>
                    )}
                </div>

                <div className="col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        {clearCartVisible && (
                            <button
                                onClick={handleClearCart}
                                className="w-full bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition duration-300"
                            >
                                Clear Cart
                            </button>
                        )}
                        <h2 className="text-2xl font-semibold mb-4 text-center">All Selected Products</h2>
                        <div className="overflow-y-auto max-h-96"> {/* Fixed height for scrollable container */}
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className="py-2">Name</th>
                                        <th className="py-2">Image</th>
                                        <th className="py-2">Price</th>
                                        <th className="py-2">Quantity</th>
                                        <th className="py-2">Action</th>
                                        <th className="py-2">Send Message</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map(product => (
                                        <tr key={product._id}>
                                            <td className="border px-4 py-2">{product.product_name || product.name}</td>
                                            <td className="border px-4 py-2">
                                                <img src={product.image} alt={product.product_name} className="w-20 h-20 object-cover" />
                                            </td>
                                            <td className="border px-4 py-2"> {(product.price).toFixed(2)}</td>
                                            <td className="border px-4 py-2">
                                                <div className="flex items-center justify-center">
                                                    <button
                                                        onClick={() => handleDecrement(product._id)}
                                                        className="bg-gray-200 text-gray-600 py-1 px-3 rounded-l-lg hover:bg-gray-300 transition duration-300"
                                                        disabled={purchaseQuantities[product._id] <= 1 || deletedId.includes(product._id)}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="mx-2">{purchaseQuantities[product._id]}</span>
                                                    <button
                                                        onClick={() => handleIncrement(product._id)}
                                                        className="bg-gray-200 text-gray-600 py-1 px-3 rounded-r-lg hover:bg-gray-300 transition duration-300"
                                                        disabled={purchaseQuantities[product._id] >= product.quantity || deletedId.includes(product._id)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                {product.quantity && (
                                                    <span className="text-sm text-red-500 text-center block mt-1">
                                                        (Max: {product.quantity})
                                                    </span>
                                                )}
                                            </td>
                                            <td className="border px-4 py-2 text-center">
                                                {deletedId.includes(product._id) ? (
                                                    <button
                                                        onClick={() => handleBack(product._id)}
                                                        className="bg-green-500 text-white py-1 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                                                    >
                                                        Want Back?
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleDelete(product._id)}
                                                        className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </td>
                                            <td className="border px-4 py-2 text-center">
                                                <button
                                                    onClick={() => handleSendMessage(product)}
                                                    className="bg-blue-500 text-white py-1 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                                                >
                                                    Send Message
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                {/* <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
                    <div className="drawer-content">
                        <h2>Payment Invoice</h2>

                        <Button onClick={() => handlePayment()} variant="contained" color="primary">
                            Confirm Payment
                        </Button>
                        {/* Close drawer button */}
                {/* <Button onClick={toggleDrawer(false)} variant="outlined" color="secondary">
                            Close
                        </Button> */}
                {/* </div> */}
                {/* </Drawer> */}
                <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
                    <div className="drawer-content">
                        <h2 className='text-yellow-600'>Payment Confirmation</h2>
                        <Invoice
                            mail={user?.email}
                            name={user?.displayName}
                            totalPrice={totalPrice}
                        // cart={cart}
                        />


                        <Button onClick={toggleDrawer(false)} variant="outlined" color="secondary">
                            Close
                        </Button>
                    </div>
                </Drawer>
            </div>
            {showMessenger && currentProduct && (
                <MessagesApp userId={currentProduct.userId} onClose={handleCloseMessenger} />
            )}
        </div>
    );
};
export default Cart;
// const Cart = () => {
//     const [cart, refetch] = useCart();
//     const { user } = useContext(AuthContext);
//     console.log(user);
//     const axiosFor = useAxiosfor();
//     const [lateCart, setLateCart] = useState([]);
//     const [deletedId, setDeletedId] = useState([]);
//     const [totalPrice, setTotalPrice] = useState(0);
//     const [totalItems, setTotalItems] = useState(0);
//     const [purchaseQuantities, setPurchaseQuantities] = useState({});
//     const [clearCartVisible, setClearCartVisible] = useState(false);
//     const [showMessenger, setShowMessenger] = useState(false);
//     const [currentProduct, setCurrentProduct] = useState(null);
//     const [authUserName, setAuthUserName] = useState(user.auth?.displayName);

//     useEffect(() => {
//         if (!user?.name && user?.uid) {
//             // Fetch user data from the backend if the user's name is null
//             axiosFor.get(`/users/${user.uid}`)
//                 .then(response => {
//                     setAuthUserName(response.data.name);
//                 })
//                 .catch(error => console.error('Error fetching user data:', error));
//         }
//         // user.name=authUserName;
//     }, [user, axiosFor]);

//     useEffect(() => {
//         setLateCart(cart.filter(item => !item.isDeleted));
//         setDeletedId(cart.filter(item => item.isDeleted).map(item => item._id));

//         const initialQuantities = {};
//         cart.forEach(item => {
//             initialQuantities[item._id] = item.purchaseQuantity || 1;
//         });
//         setPurchaseQuantities(initialQuantities);
//     }, [cart]);

//     useEffect(() => {
//         setTotalPrice(
//             lateCart.reduce((sum, item) => sum + (item.price * (purchaseQuantities[item._id] || 1)), 0).toFixed(2)
//         );
//         setTotalItems(lateCart.reduce((sum, item) => sum + (purchaseQuantities[item._id] || 1), 0));

//         // Show clear cart button only if all items are deleted
//         setClearCartVisible(deletedId.length > 0 && deletedId.length === cart.length);
//     }, [lateCart, purchaseQuantities, deletedId, cart.length]);

//     const handleBack = (productId) => {
//         const updatedDeletedId = deletedId.filter(dId => productId !== dId);
//         setDeletedId(updatedDeletedId);

//         const restoredProduct = cart.find(prod => prod._id === productId);
//         if (restoredProduct) {
//             setLateCart([...lateCart, restoredProduct]);
//         }

//         axiosFor.put(`/cart/${productId}/getback`, restoredProduct)
//             .then(res => {
//                 if (res.data.modifiedCount) {
//                     refetch();
//                 }
//             });
//     };

//     const handleDelete = (productId) => {
//         setDeletedId([...deletedId, productId]);
//         setLateCart(lateCart.filter(oneItem => oneItem._id !== productId));

//         const deletedProduct = cart.find(item => item._id === productId);
//         axiosFor.put(`/cart/${productId}/delete`, deletedProduct)
//             .then(res => {
//                 if (res.data.modifiedCount) {
//                     refetch();
//                 }
//             });
//     };

//     const handlePayment = (del) => {
//         const ans = confirm("Do you want to proceed?");
//         if (ans) {
//             del.map(delId => {
//                 axiosFor.delete(`/cart/${delId}`)
//                     .then(res => {
//                         console.log(res);
//                         refetch();
//                     });
//             });
//         }
//     };

//     const handleClearCart = () => {
//         handlePayment(deletedId);
//     };

//     const handleIncrement = (productId) => {
//         const newPurchaseQuantities = { ...purchaseQuantities, [productId]: (purchaseQuantities[productId] || 1) + 1 };
//         setPurchaseQuantities(newPurchaseQuantities);
//         axiosFor.put(`/cart/${productId}/update-quantity`, { quantity: newPurchaseQuantities[productId] })
//             .then(res => {
//                 console.log(res.data);
//             });
//     };

//     const handleDecrement = (productId) => {
//         if (purchaseQuantities[productId] > 1) {
//             const newPurchaseQuantities = { ...purchaseQuantities, [productId]: purchaseQuantities[productId] - 1 };
//             setPurchaseQuantities(newPurchaseQuantities);
//             axiosFor.put(`/cart/${productId}/update-quantity`, { quantity: newPurchaseQuantities[productId] })
//                 .then(res => {
//                     console.log(res.data);
//                 });
//         }
//     };

//     const handleSendMessage = (product) => {
//         console.log(product);
//         setCurrentProduct(product);
//         setShowMessenger(true);
//     };

//     const handleCloseMessenger = () => {
//         setShowMessenger(false);
//         setCurrentProduct(null);
//     };

//     return (
//         <div className="container mx-auto p-4">
//             <Helmet>
//                 <title>My Cart</title>
//             </Helmet>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="bg-white p-6 rounded-lg shadow-lg col-span-1">
//                     <h2 className="text-2xl font-semibold mb-4 text-center">Order Summary</h2>
//                     <div className="border-t border-gray-200 py-4">
//                         <div className="flex justify-between text-lg">
//                             <span>Items:</span>
//                             <span>{totalItems}</span>
//                         </div>
//                         <div className="flex justify-between text-lg mt-2">
//                             <span>Total Price:</span>
//                             <span>${totalPrice}</span>
//                         </div>
//                     </div>
//                     {lateCart.length > 0 && (
//                         <button
//                             // onClick={() => handlePayment(deletedId)}
//                             className="w-full bg-blue-500 text-white font-semibold py-2 mt-4 rounded-lg hover:bg-blue-600 transition duration-300"
//                         >
//                             Pay
//                         </button>
//                     )}
//                 </div>

//                 <div className="col-span-2">
//                     <div className="bg-white p-6 rounded-lg shadow-lg">
//                         {clearCartVisible && (
//                             <button
//                                 onClick={handleClearCart}
//                                 className="w-full bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition duration-300"
//                             >
//                                 Clear Cart
//                             </button>
//                         )}
//                         <h2 className="text-2xl font-semibold mb-4 text-center">All Selected Products</h2>
//                         <div className="overflow-x-auto">
//                             <table className="min-w-full bg-white">
//                                 <thead>
//                                     <tr>
//                                         <th className="py-2">Name</th>
//                                         <th className="py-2">Image</th>
//                                         <th className="py-2">Price</th>
//                                         <th className="py-2">Quantity</th>
//                                         <th className="py-2">Action</th>
//                                         <th className="py-2">Send Message</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {cart.map(product => (
//                                         <tr key={product._id}>
//                                             <td className="border px-4 py-2">{product.product_name || product.name}</td>
//                                             <td className="border px-4 py-2">
//                                                 <img src={product.image} alt={product.product_name} className="w-20 h-20 object-cover" />
//                                             </td>
//                                             <td className="border px-4 py-2">${product.price}</td>
//                                             <td className="border px-4 py-2">
//                                                 <div className="flex items-center justify-center">
//                                                     <button
//                                                         onClick={() => handleDecrement(product._id)}
//                                                         className="bg-gray-200 text-gray-600 py-1 px-3 rounded-l-lg hover:bg-gray-300 transition duration-300"
//                                                         disabled={purchaseQuantities[product._id] <= 1 || deletedId.includes(product._id)}
//                                                     >
//                                                         -
//                                                     </button>
//                                                     <span className="mx-2">{purchaseQuantities[product._id]}</span>
//                                                     <button
//                                                         onClick={() => handleIncrement(product._id)}
//                                                         className="bg-gray-200 text-gray-600 py-1 px-3 rounded-r-lg hover:bg-gray-300 transition duration-300"
//                                                         disabled={purchaseQuantities[product._id] >= product.quantity || deletedId.includes(product._id)}
//                                                     >
//                                                         +
//                                                     </button>
//                                                 </div>
//                                                 {purchaseQuantities[product._id] >= product.quantity && (
//                                                     <span className="text-red-500 text-xs">
//                                                         Max: {product.quantity}
//                                                     </span>
//                                                 )}
//                                             </td>
//                                             <td className="border px-4 py-2 text-center">
//                                                 {deletedId.includes(product._id) ? (
//                                                     <button
//                                                         onClick={() => handleBack(product._id)}
//                                                         className="bg-green-500 text-white py-1 px-4 rounded-lg hover:bg-green-600 transition duration-300"
//                                                     >
//                                                         Want Back?
//                                                     </button>
//                                                 ) : (
//                                                     <button
//                                                         onClick={() => handleDelete(product._id)}
//                                                         className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600 transition duration-300"
//                                                     >
//                                                         Delete
//                                                     </button>
//                                                 )}
//                                             </td>
//                                             <td className="border px-4 py-2 text-center">
//                                                 <button
//                                                     onClick={() => handleSendMessage(product)}
//                                                     className="bg-blue-500 text-white py-1 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
//                                                 >
//                                                     Send Message
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             {showMessenger && currentProduct && (
//                 <MessagesApp product={{ user, currentProduct }} onClose={handleCloseMessenger} />
//             )}
//         </div>
//     );
// };


// const Cart = () => {
//     const [cart, refetch] = useCart();
//     const { user } = useContext(AuthContext);
//     const axiosFor = useAxiosfor();
//     const [lateCart, setLateCart] = useState([]);
//     const [deletedId, setDeletedId] = useState([]);
//     const [totalPrice, setTotalPrice] = useState(0);
//     const [totalItems, setTotalItems] = useState(0);
//     const [purchaseQuantities, setPurchaseQuantities] = useState({});
//     const [clearCartVisible, setClearCartVisible] = useState(false);
//     const [showMessenger, setShowMessenger] = useState(false);
//     const [currentProduct, setCurrentProduct] = useState(null);
//     const [authUserName, setAuthUserName] = useState(user?.auth.displayName);

//     useEffect(() => {
//         if (!user?.name && user?.uid) {
//             // Fetch user data from the backend if the user's name is null
//             axiosFor.get(`/users/${user.uid}`)
//                 .then(response => {
//                     setAuthUserName(response.data.name);
//                 })
//                 .catch(error => console.error('Error fetching user data:', error));
//         }
//     }, [user, axiosFor]);

//     useEffect(() => {
//         setLateCart(cart.filter(item => !item.isDeleted));
//         setDeletedId(cart.filter(item => item.isDeleted).map(item => item._id));

//         const initialQuantities = {};
//         cart.forEach(item => {
//             initialQuantities[item._id] = item.purchaseQuantity || 1;
//         });
//         setPurchaseQuantities(initialQuantities);
//     }, [cart]);

//     useEffect(() => {
//         setTotalPrice(
//             lateCart.reduce((sum, item) => sum + (item.price * (purchaseQuantities[item._id] || 1)), 0).toFixed(2)
//         );
//         setTotalItems(lateCart.reduce((sum, item) => sum + (purchaseQuantities[item._id] || 1), 0));

//         // Show clear cart button only if all items are deleted
//         setClearCartVisible(deletedId.length > 0 && deletedId.length === cart.length);
//     }, [lateCart, purchaseQuantities, deletedId, cart.length]);

//     const handleBack = (productId) => {
//         const updatedDeletedId = deletedId.filter(dId => productId !== dId);
//         setDeletedId(updatedDeletedId);

//         const restoredProduct = cart.find(prod => prod._id === productId);
//         if (restoredProduct) {
//             setLateCart([...lateCart, restoredProduct]);
//         }

//         axiosFor.put(`/cart/${productId}/getback`, restoredProduct)
//             .then(res => {
//                 if (res.data.modifiedCount) {
//                     refetch();
//                 }
//             });
//     };

//     const handleDelete = (productId) => {
//         setDeletedId([...deletedId, productId]);
//         setLateCart(lateCart.filter(oneItem => oneItem._id !== productId));

//         const deletedProduct = cart.find(item => item._id === productId);
//         axiosFor.put(`/cart/${productId}/delete`, deletedProduct)
//             .then(res => {
//                 if (res.data.modifiedCount) {
//                     refetch();
//                 }
//             });
//     };

//     const handlePayment = (del) => {
//         const ans = confirm("Do you want to proceed?");
//         if (ans) {
//             del.map(delId => {
//                 axiosFor.delete(`/cart/${delId}`)
//                     .then(res => {
//                         console.log(res);
//                         refetch();
//                     });
//             });
//         }
//     };

//     const handleClearCart = () => {
//         handlePayment(deletedId);
//     };

//     const handleIncrement = (productId) => {
//         const newPurchaseQuantities = { ...purchaseQuantities, [productId]: (purchaseQuantities[productId] || 1) + 1 };
//         setPurchaseQuantities(newPurchaseQuantities);
//         axiosFor.put(`/cart/${productId}/update-quantity`, { quantity: newPurchaseQuantities[productId] })
//             .then(res => {
//                 console.log(res.data);
//             });
//     };

//     const handleDecrement = (productId) => {
//         if (purchaseQuantities[productId] > 1) {
//             const newPurchaseQuantities = { ...purchaseQuantities, [productId]: purchaseQuantities[productId] - 1 };
//             setPurchaseQuantities(newPurchaseQuantities);
//             axiosFor.put(`/cart/${productId}/update-quantity`, { quantity: newPurchaseQuantities[productId] })
//                 .then(res => {
//                     console.log(res.data);
//                 });
//         }
//     };

//     const handleSendMessage = (product) => {
//         setCurrentProduct(product);
//         setShowMessenger(true);
//     };

//     const handleCloseMessenger = () => {
//         setShowMessenger(false);
//         setCurrentProduct(null);
//     };

//     return (
//         <div className="container mx-auto p-4">
//             <Helmet>
//                 <title>My Cart</title>
//             </Helmet>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="bg-white p-6 rounded-lg shadow-lg col-span-1">
//                     <h2 className="text-2xl font-semibold mb-4 text-center">Order Summary</h2>
//                     <div className="border-t border-gray-200 py-4">
//                         <div className="flex justify-between text-lg">
//                             <span>Items:</span>
//                             <span>{totalItems}</span>
//                         </div>
//                         <div className="flex justify-between text-lg mt-2">
//                             <span>Total Price:</span>
//                             <span>${totalPrice}</span>
//                         </div>
//                     </div>
//                     {lateCart.length > 0 && (
//                         <button
//                             // onClick={() => handlePayment(deletedId)}
//                             className="w-full bg-blue-500 text-white font-semibold py-2 mt-4 rounded-lg hover:bg-blue-600 transition duration-300"
//                         >
//                             Pay
//                         </button>
//                     )}
//                 </div>

//                 <div className="col-span-2">
//                     <div className="bg-white p-6 rounded-lg shadow-lg">
//                         {clearCartVisible && (
//                             <button
//                                 onClick={handleClearCart}
//                                 className="w-full bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition duration-300"
//                             >
//                                 Clear Cart
//                             </button>
//                         )}
//                         <h2 className="text-2xl font-semibold mb-4 text-center">All Selected Products</h2>
//                         <div className="overflow-x-auto">
//                             <table className="min-w-full bg-white">
//                                 <thead>
//                                     <tr>
//                                         <th className="py-2">Name</th>
//                                         <th className="py-2">Image</th>
//                                         <th className="py-2">Price</th>
//                                         <th className="py-2">Quantity</th>
//                                         <th className="py-2">Action</th>
//                                         <th className="py-2">Send Message</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {cart.map(product => (
//                                         <tr key={product._id}>
//                                             <td className="border px-4 py-2">{product.product_name || product.name}</td>
//                                             <td className="border px-4 py-2">
//                                                 <img src={product.image} alt={product.product_name} className="w-20 h-20 object-cover" />
//                                             </td>
//                                             <td className="border px-4 py-2">${product.price}</td>
//                                             <td className="border px-4 py-2">
//                                                 <div className="flex items-center justify-center">
//                                                     <button
//                                                         onClick={() => handleDecrement(product._id)}
//                                                         className="bg-gray-200 text-gray-600 py-1 px-3 rounded-l-lg hover:bg-gray-300 transition duration-300"
//                                                         disabled={purchaseQuantities[product._id] <= 1 || deletedId.includes(product._id)}
//                                                     >
//                                                         -
//                                                     </button>
//                                                     <span className="mx-2">{purchaseQuantities[product._id]}</span>
//                                                     <button
//                                                         onClick={() => handleIncrement(product._id)}
//                                                         className="bg-gray-200 text-gray-600 py-1 px-3 rounded-r-lg hover:bg-gray-300 transition duration-300"
//                                                         disabled={purchaseQuantities[product._id] >= product.quantity || deletedId.includes(product._id)}
//                                                     >
//                                                         +
//                                                     </button>
//                                                 </div>
//                                                 {product.quantity && (
//                                                     <span className="text-sm text-red-500 text-center block mt-1">
//                                                         (Max: {product.quantity})
//                                                     </span>
//                                                 )}
//                                             </td>
//                                             <td className="border px-4 py-2 text-center">
//                                                 {deletedId.includes(product._id) ? (
//                                                     <button
//                                                         onClick={() => handleBack(product._id)}
//                                                         className="bg-green-500 text-white py-1 px-4 rounded-lg hover:bg-green-600 transition duration-300"
//                                                     >
//                                                         Want Back?
//                                                     </button>
//                                                 ) : (
//                                                     <button
//                                                         onClick={() => handleDelete(product._id)}
//                                                         className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600 transition duration-300"
//                                                     >
//                                                         Delete
//                                                     </button>
//                                                 )}
//                                             </td>
//                                             <td className="border px-4 py-2 text-center">
//                                                 <button
//                                                     onClick={() => handleSendMessage(product)}
//                                                     className="bg-blue-500 text-white py-1 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
//                                                 >
//                                                     Send Message
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             {showMessenger && currentProduct && (
//                 <MessagesApp product={{ user: { ...user, name: authUserName }, currentProduct }} onClose={handleCloseMessenger} />
//             )}
//         </div>
//     );
// };
// const Cart = () => {
//     const [cart, refetch] = useCart();
//     const axiosFor = useAxiosfor();
//     const [lateCart, setLateCart] = useState([]);
//     const [deletedId, setDeletedId] = useState([]);
//     const [totalPrice, setTotalPrice] = useState(0);
//     const [totalItems, setTotalItems] = useState(0);
//     const [purchaseQuantities, setPurchaseQuantities] = useState({});
//     const [clearCartVisible, setClearCartVisible] = useState(false);

//     useEffect(() => {
//         setLateCart(cart.filter(item => !item.isDeleted));
//         setDeletedId(cart.filter(item => item.isDeleted).map(item => item._id));

//         const initialQuantities = {};
//         cart.forEach(item => {
//             initialQuantities[item._id] = item.purchaseQuantity || 1;
//         });
//         setPurchaseQuantities(initialQuantities);
//     }, [cart]);

//     useEffect(() => {
//         setTotalPrice(
//             lateCart.reduce((sum, item) => sum + (item.price * (purchaseQuantities[item._id] || 1)), 0).toFixed(2)
//         );
//         setTotalItems(lateCart.reduce((sum, item) => sum + (purchaseQuantities[item._id] || 1), 0));

//         // Show clear cart button only if all items are deleted
//         setClearCartVisible(deletedId.length > 0 && deletedId.length === cart.length);
//     }, [lateCart, purchaseQuantities, deletedId, cart.length]);

//     const handleBack = (productId) => {
//         const updatedDeletedId = deletedId.filter(dId => productId !== dId);
//         setDeletedId(updatedDeletedId);

//         const restoredProduct = cart.find(prod => prod._id === productId);
//         if (restoredProduct) {
//             setLateCart([...lateCart, restoredProduct]);
//         }

//         axiosFor.put(`/cart/${productId}/getback`, restoredProduct)
//             .then(res => {
//                 if (res.data.modifiedCount) {
//                     refetch();
//                 }
//             });
//     };

//     const handleDelete = (productId) => {
//         setDeletedId([...deletedId, productId]);
//         setLateCart(lateCart.filter(oneItem => oneItem._id !== productId));

//         const deletedProduct = cart.find(item => item._id === productId);
//         axiosFor.put(`/cart/${productId}/delete`, deletedProduct)
//             .then(res => {
//                 if (res.data.modifiedCount) {
//                     refetch();
//                 }
//             });
//     };

//     const handlePayment = (del) => {
//         const ans = confirm("Do you want to proceed?");
//         if (ans) {
//             del.map(delId => {
//                 axiosFor.delete(`/cart/${delId}`)
//                     .then(res => {
//                         console.log(res);
//                         refetch();
//                     });
//             });
//         }
//     };

//     const handleClearCart = () => {
//         handlePayment(deletedId);
//     };

//     const handleIncrement = (productId) => {
//         const newPurchaseQuantities = { ...purchaseQuantities, [productId]: (purchaseQuantities[productId] || 1) + 1 };
//         setPurchaseQuantities(newPurchaseQuantities);
//         axiosFor.put(`/cart/${productId}/update-quantity`, { quantity: newPurchaseQuantities[productId] })
//             .then(res => {
//                 console.log(res.data);
//             });
//     };

//     const handleDecrement = (productId) => {
//         if (purchaseQuantities[productId] > 1) {
//             const newPurchaseQuantities = { ...purchaseQuantities, [productId]: purchaseQuantities[productId] - 1 };
//             setPurchaseQuantities(newPurchaseQuantities);
//             axiosFor.put(`/cart/${productId}/update-quantity`, { quantity: newPurchaseQuantities[productId] })
//                 .then(res => {
//                     console.log(res.data);
//                 });
//         }
//     };

//     const handleSendMessage = (productId) => {
//         alert(`Message sent for product ID: ${productId}`);
//     };

//     return (
//         <div className="container mx-auto p-4">
//             <Helmet>
//                 <title>My Cart</title>
//             </Helmet>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="bg-white p-6 rounded-lg shadow-lg col-span-1">
//                     <h2 className="text-2xl font-semibold mb-4 text-center">Order Summary</h2>
//                     <div className="border-t border-gray-200 py-4">
//                         <div className="flex justify-between text-lg">
//                             <span>Items:</span>
//                             <span>{totalItems}</span>
//                         </div>
//                         <div className="flex justify-between text-lg mt-2">
//                             <span>Total Price:</span>
//                             <span>${totalPrice}</span>
//                         </div>
//                     </div>
//                     {lateCart.length > 0 && (
//                         <button
//                             // onClick={() => handlePayment(deletedId)}
//                             className="w-full bg-blue-500 text-white font-semibold py-2 mt-4 rounded-lg hover:bg-blue-600 transition duration-300"
//                         >
//                             Pay
//                         </button>
//                     )}
//                 </div>

//                 <div className="col-span-2">
//                     <div className="bg-white p-6 rounded-lg shadow-lg">
//                         {clearCartVisible && (
//                             <button
//                                 onClick={handleClearCart}
//                                 className="w-full bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition duration-300"
//                             >
//                                 Clear Cart
//                             </button>
//                         )}
//                         <h2 className="text-2xl font-semibold mb-4 text-center">All Selected Products</h2>
//                         <div className="overflow-x-auto">
//                             <table className="min-w-full bg-white">
//                                 <thead>
//                                     <tr>
//                                         <th className="py-2">Name</th>
//                                         <th className="py-2">Image</th>
//                                         <th className="py-2">Price</th>
//                                         <th className="py-2">Quantity</th>
//                                         <th className="py-2">Action</th>
//                                         <th className="py-2">Send Message</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {cart.map(product => (
//                                         <tr key={product._id}>
//                                             <td className="border px-4 py-2">{product.product_name || product.name}</td>
//                                             <td className="border px-4 py-2">
//                                                 <img src={product.image} alt={product.product_name} className="w-20 h-20 object-cover" />
//                                             </td>
//                                             <td className="border px-4 py-2">${product.price}</td>
//                                             <td className="border px-4 py-2">
//                                                 <div className="flex items-center justify-center">
//                                                     <button
//                                                         onClick={() => handleDecrement(product._id)}
//                                                         className="bg-gray-200 text-gray-600 py-1 px-3 rounded-l-lg hover:bg-gray-300 transition duration-300"
//                                                         disabled={purchaseQuantities[product._id] <= 1 || deletedId.includes(product._id)}
//                                                     >
//                                                         -
//                                                     </button>
//                                                     <span className="mx-2">{purchaseQuantities[product._id]}</span>
//                                                     <button
//                                                         onClick={() => handleIncrement(product._id)}
//                                                         className="bg-gray-200 text-gray-600 py-1 px-3 rounded-r-lg hover:bg-gray-300 transition duration-300"
//                                                         disabled={purchaseQuantities[product._id] >= product.quantity || deletedId.includes(product._id)}
//                                                     >
//                                                         +
//                                                     </button>
//                                                 </div>
//                                                 {product.quantity && (
//                                                     <span className="text-sm text-red-500 text-center block mt-1">
//                                                         (Max: {product.quantity})
//                                                     </span>
//                                                 )}
//                                             </td>
//                                             <td className="border px-4 py-2 text-center">
//                                                 {deletedId.includes(product._id) ? (
//                                                     <button
//                                                         onClick={() => handleBack(product._id)}
//                                                         className="bg-green-500 text-white py-1 px-4 rounded-lg hover:bg-green-600 transition duration-300"
//                                                     >
//                                                         Want Back?
//                                                     </button>
//                                                 ) : (
//                                                     <button
//                                                         onClick={() => handleDelete(product._id)}
//                                                         className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600 transition duration-300"
//                                                     >
//                                                         Delete
//                                                     </button>
//                                                 )}
//                                             </td>
//                                             <td className="border px-4 py-2 text-center">
//                                                 <button
//                                                     onClick={() => handleSendMessage(product._id)}
//                                                     className="bg-blue-500 text-white py-1 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
//                                                 >
//                                                     Send Message
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };



// const Cart = () => {
//     const [cart, refetch] = useCart();
//     const axiosFor = useAxiosfor();
//     const [lateCart, setLateCart] = useState([]);
//     const [deletedId, setDeletedId] = useState([]);
//     const [totalPrice, setTotalPrice] = useState(0);
//     const [totalItems, setTotalItems] = useState(0);
//     const [purchaseQuantities, setPurchaseQuantities] = useState({});
//     const [clearCartVisible, setClearCartVisible] = useState(false);

//     useEffect(() => {
//         setLateCart(cart.filter(item => !item.isDeleted));
//         setDeletedId(cart.filter(item => item.isDeleted).map(item => item._id));

//         const initialQuantities = {};
//         cart.forEach(item => {
//             initialQuantities[item._id] = item.purchaseQuantity || 1;
//         });
//         setPurchaseQuantities(initialQuantities);
//     }, [cart]);

//     useEffect(() => {
//         setTotalPrice(
//             lateCart.reduce((sum, item) => sum + (item.price * (purchaseQuantities[item._id] || 1)), 0).toFixed(2)
//         );
//         setTotalItems(lateCart.reduce((sum, item) => sum + (purchaseQuantities[item._id] || 1), 0));

//         // Show clear cart button only if all items are deleted
//         setClearCartVisible(deletedId.length > 0 && deletedId.length === cart.length);
//     }, [lateCart, purchaseQuantities, deletedId, cart.length]);

//     const handleBack = (productId) => {
//         const updatedDeletedId = deletedId.filter(dId => productId !== dId);
//         setDeletedId(updatedDeletedId);

//         const restoredProduct = cart.find(prod => prod._id === productId);
//         if (restoredProduct) {
//             setLateCart([...lateCart, restoredProduct]);
//         }

//         axiosFor.put(`/cart/${productId}/getback`, restoredProduct)
//             .then(res => {
//                 if (res.data.modifiedCount) {
//                     refetch();
//                 }
//             });
//     };

//     const handleDelete = (productId) => {
//         setDeletedId([...deletedId, productId]);
//         setLateCart(lateCart.filter(oneItem => oneItem._id !== productId));

//         const deletedProduct = cart.find(item => item._id === productId);
//         axiosFor.put(`/cart/${productId}/delete`, deletedProduct)
//             .then(res => {
//                 if (res.data.modifiedCount) {
//                     refetch();
//                 }
//             });
//     };

//     const handlePayment = (del) => {
//         const ans = confirm("Do you want to proceed?");
//         if (ans) {
//             del.map(delId => {
//                 axiosFor.delete(`/cart/${delId}`)
//                     .then(res => {
//                         console.log(res);
//                         refetch();
//                     });
//             });
//         }
//     };

//     const handleClearCart = () => {
//         handlePayment(deletedId);
//     };

//     const handleIncrement = (productId) => {
//         const newPurchaseQuantities = { ...purchaseQuantities, [productId]: (purchaseQuantities[productId] || 1) + 1 };
//         setPurchaseQuantities(newPurchaseQuantities);
//         axiosFor.put(`/cart/${productId}/update-quantity`, { quantity: newPurchaseQuantities[productId] })
//             .then(res => {
//                 console.log(res.data);
//             });
//     };

//     const handleDecrement = (productId) => {
//         if (purchaseQuantities[productId] > 1) {
//             const newPurchaseQuantities = { ...purchaseQuantities, [productId]: purchaseQuantities[productId] - 1 };
//             setPurchaseQuantities(newPurchaseQuantities);
//             axiosFor.put(`/cart/${productId}/update-quantity`, { quantity: newPurchaseQuantities[productId] })
//                 .then(res => {
//                     console.log(res.data);
//                 });
//         }
//     };

//     return (
//         <div className="container mx-auto p-4">
//             <Helmet>
//                 <title>My Cart</title>
//             </Helmet>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="bg-white p-6 rounded-lg shadow-lg col-span-1">
//                     <h2 className="text-2xl font-semibold mb-4 text-center">Order Summary</h2>
//                     <div className="border-t border-gray-200 py-4">
//                         <div className="flex justify-between text-lg">
//                             <span>Items:</span>
//                             <span>{totalItems}</span>
//                         </div>
//                         <div className="flex justify-between text-lg mt-2">
//                             <span>Total Price:</span>
//                             <span>${totalPrice}</span>
//                         </div>
//                     </div>
//                     {lateCart.length > 0 && (
//                         <button
//                             // onClick={() => handlePayment(deletedId)}
//                             className="w-full bg-blue-500 text-white font-semibold py-2 mt-4 rounded-lg hover:bg-blue-600 transition duration-300"
//                         >
//                             Pay
//                         </button>
//                     )}
//                 </div>

//                 <div className="col-span-2">
//                     <div className="bg-white p-6 rounded-lg shadow-lg">
//                         {clearCartVisible && (
//                             <button
//                                 onClick={handleClearCart}
//                                 className="w-full bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition duration-300"
//                             >
//                                 Clear Cart
//                             </button>
//                         )}
//                         <h2 className="text-2xl font-semibold mb-4 text-center">All Selected Products</h2>
//                         <div className="overflow-x-auto">
//                             <table className="min-w-full bg-white">
//                                 <thead>
//                                     <tr>
//                                         <th className="py-2">Name</th>
//                                         <th className="py-2">Image</th>
//                                         <th className="py-2">Price</th>
//                                         <th className="py-2">Quantity</th>
//                                         <th className="py-2">Action</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {cart.map(product => (
//                                         <tr key={product._id}>
//                                             <td className="border px-4 py-2">{product.product_name || product.name}</td>
//                                             <td className="border px-4 py-2">
//                                                 <img src={product.image} alt={product.product_name} className="w-20 h-20 object-cover" />
//                                             </td>
//                                             <td className="border px-4 py-2">${product.price}</td>
//                                             <td className="border px-4 py-2">
//                                                 <div className="flex items-center justify-center">
//                                                     <button
//                                                         onClick={() => handleDecrement(product._id)}
//                                                         className="bg-gray-200 text-gray-600 py-1 px-3 rounded-l-lg hover:bg-gray-300 transition duration-300"
//                                                         disabled={purchaseQuantities[product._id] <= 1 || deletedId.includes(product._id)}
//                                                     >
//                                                         -
//                                                     </button>
//                                                     <span className="mx-2">{purchaseQuantities[product._id]}</span>
//                                                     <button
//                                                         onClick={() => handleIncrement(product._id)}
//                                                         className="bg-gray-200 text-gray-600 py-1 px-3 rounded-r-lg hover:bg-gray-300 transition duration-300"
//                                                         disabled={purchaseQuantities[product._id] >= product.quantity || deletedId.includes(product._id)}
//                                                     >
//                                                         +
//                                                     </button>
//                                                 </div>
//                                                 {product.quantity && (
//                                                     <span className="text-sm text-red-500 text-center block mt-1">
//                                                         (Max: {product.quantity})
//                                                     </span>
//                                                 )}
//                                             </td>
//                                             <td className="border px-4 py-2 text-center">
//                                                 {deletedId.includes(product._id) ? (
//                                                     <button
//                                                         onClick={() => handleBack(product._id)}
//                                                         className="bg-green-500 text-white py-1 px-4 rounded-lg hover:bg-green-600 transition duration-300"
//                                                     >
//                                                         Want Back?
//                                                     </button>
//                                                 ) : (
//                                                     <button
//                                                         onClick={() => handleDelete(product._id)}
//                                                         className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600 transition duration-300"
//                                                     >
//                                                         Delete
//                                                     </button>
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
// export default Cart;
// const Cart = () => {
//     const [cart, refetch] = useCart();
//     console.log(cart);
//     const axiosFor = useAxiosfor();
//     // console.log(cart);
//     const [lateCart, setLateCart] = useState([]);
//     // console.log(lateCart);
//     const [deletedId, setDeletedId] = useState([]);
//     // console.log(lateCart, deletedId);
//     // console.log(deletedId);
//     // console.log("del", deletedId);
//     const [totalPrice, setTotalPrice] = useState(0);
//     // const deletedId=[];
//     const [totalItems, setTotalItems] = useState(0);

//     useEffect(() => {
//         setLateCart(cart.filter(item => item.isDeleted === false));
//         setDeletedId(cart.filter(item => item.isDeleted === true).map((item => item._id)));
//     }, [cart]);

//     useEffect(() => {
//         // setLateCart;
//         // setDeletedId;
//         setTotalPrice(
//             // lateCart.length===0?cart.reduce((sum, item) => sum + item.price, 0).toFixed(2):
//             lateCart.reduce((sum, item) => sum + item.price, 0).toFixed(2)
//         );
//         setTotalItems(
//             lateCart.length
//         )
//     }, [cart, lateCart, deletedId]);
//     // const totalItems=lateCart.length;
//     // console.log( cart);

//     // const [deleteOrBack, setDeleteOrBack] = useState(1);
//     // console.log(deleteOrBack);
//     // var deleteOrBack;

//     const handleBack = (productId, deleteBack) => {

//         // if (deleteBack === 1) {
//         if (deletedId.length >= 1) {
//             const delId = deletedId.filter(dId => productId !== dId);
//             // console.log(delId);
//             setDeletedId(delId);
//         }
//         else {
//             setDeletedId([]);
//         }
//         if (lateCart.length >= 1 && lateCart.length < cart.length) {
//             setLateCart([...lateCart, cart.find(prod => prod._id === productId)]);
//         }
//         else if (lateCart.length < 1) {
//             const lCart = cart.find(prod => prod._id === productId);
//             setLateCart([lCart]);
//         }

//         cart.find(item => {
//             if (item._id === productId) {
//                 axiosFor.put(`/cart/${productId}/getback`, item)
//                     .then(res => {
//                         console.log(res.data);
//                         if (res.data.modifiedCount) {
//                             alert("Cart Updated false");
//                         }
//                         //////to update the count.
//                         //   refetch();
//                     })
//             }
//         })
//         // totalPrice = lateCart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
//         // setTotalPrice(totalPrice);
//         // setDeleteOrBack(deleteBack);
//         // }
//     }

//     const handleDelete = (productId, deleteBack) => {
//         // console.log(cart, productId, deleteBack);

//         // setDeleteOrBack(true);

//         deletedId.length >= 1 && setDeletedId([...deletedId, productId]);
//         deletedId.length < 1 && setDeletedId([productId]);


//         // console.log(deleteBack, deletedId);
//         // setDeletedId(deletedId.length===0?productId:...deletedId,);
//         if (lateCart.length >= 1) {
//             const latecart = lateCart.filter(oneItem => oneItem._id !== productId);
//             setLateCart(latecart);
//         }

//         cart.find(item => {
//             if (item._id === productId) {
//                 axiosFor.put(`/cart/${productId}/delete`, item)
//                     .then(res => {
//                         console.log(res.data);
//                         if (res.data.modifiedCount) {
//                             alert("Cart Updated true");
//                         }
//                         //////to update the count.
//                         //   refetch();
//                     })
//             }
//         })
//         // console.log(lateCart, lateCart.length);
//         // totalPrice = lateCart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
//         // setTotalPrice(totalPrice);
//         // setDeleteOrBack(deleteBack);
//         // console.log(totalPrice);

//         // console.log(deleteOrBack);

//         // console.log(productId);
//         // try {
//         //     await axios.delete(`/api/products/${productId}`); // Assuming your backend API endpoint for deleting a product is '/api/products/:productId'
//         //     // fetchProducts(); // Fetch products again after deletion
//         // } catch (error) {
//         //     console.error('Error deleting product:', error);
//         // }
//     };

//     const handlePayment = (del) => {
//         const ans = confirm("Do you want to proceed?");
//         if (ans) {
//             del.map(delId => {
//                 axiosFor.delete(`/cart/${delId}`)
//                     .then(res => {
//                         console.log(res);
//                         // if(res.data.deletedCount>0){
//                         refetch();
//                         // }
//                     })
//             })
//         }
//     }

//     return (
//         <div className="md:flex items-center gap-4 ml-4">
//             <Helmet>
//                 <title>My Carts</title>
//             </Helmet>
//             <div className="bg-yellow-200 p-4 rounded shadow-md mb-8 md:w-1/2">
//                 <h2 className="text-lg text-center font-semibold mb-0">Order Summary</h2>
//                 <div className="divider divider-info"></div>
//                 <div className="mb-4 flex sm:flex-col justify-between gap-1">
//                     <div className="flex justify-between md:text-2xl sm:text-lg">
//                         <p className="font-medium">Items:</p>
//                         <p className="font-medium ml-2">{totalItems}</p>
//                     </div>
//                     <div className="flex justify-between md:text-2xl sm:text-lg">
//                         <p className="font-medium">Total Price:</p>
//                         <p className="font-medium ml-2">${totalPrice}</p>
//                     </div>
//                     {
//                         lateCart.length > 0 && <button onClick={() => handlePayment(deletedId)} className="btn btn-primary font-semibold">Pay</button>
//                     }
//                 </div>
//             </div>
//             {/* Product Table */}
//             <div className="bg-yellow-200 p-12 mt-0 rounded shadow-md overflow-x-auto">
//                 {
//                     lateCart.length <= 0 && <button onClick={() => handlePayment(deletedId)} className="btn btn-primary text-lg font-semibold">Clear-Cart</button>
//                 }
//                 <h2 className="text-lg font-semibold mb-1 text-center">All Selected Products</h2>
//                 <div className="divider divider-info"></div>
//                 <table className="table-auto w-full">
//                     <thead>
//                         <tr>
//                             <th className="px-4 py-2 font-semibold">Name</th>
//                             <th className="px-4 py-2 font-semibold">Image</th>
//                             <th className="px-4 py-2 font-semibold">Price</th>
//                             <th className="px-4 py-2 font-semibold">Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {cart.map(product => (
//                             <tr key={product._id}>
//                                 {product.product_name?<td className="border px-4 py-2">{product.product_name}</td>:<td className="border px-4 py-2">{product.name}</td>}
//                                 {/* <td><figure><img className="rounded-3xl p-4 md:m-3 md:w-80 sm:mb-6 sm:mt-6 sm:h-44 md:h-80" src={product.image} alt="Album" /></figure></td> */}
//                                 <td className="border px-4 py-2"><img src={product.image} alt={product.product_name} style={{ width: '200px', height: '100px' }} /></td>
//                                 <td className="border px-4 py-2">${product.price}</td>
//                                 <td className="border px-4 py-2">
//                                     {(deletedId.includes(product._id)) && (
//                                         <button
//                                             onClick={() => handleBack(product._id)}
//                                             className="btn btn-success text-white font-semibold"
//                                         >
//                                             Want Back?
//                                         </button>
//                                     )}
//                                     {
//                                         (deletedId.indexOf(product._id) === -1) && (
//                                             <button
//                                                 onClick={() => handleDelete(product._id)}
//                                                 className="btn btn-error font-semibold"
//                                             >
//                                                 Delete
//                                             </button>
//                                         )}
//                                         {/* {refetch()} */}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// const Cart = () => {
//     const [cart, refetch] = useCart();
//     const axiosFor = useAxiosfor();
//     const [lateCart, setLateCart] = useState([]);
//     const [deletedId, setDeletedId] = useState([]);
//     const [totalPrice, setTotalPrice] = useState(0);
//     const [totalItems, setTotalItems] = useState(0);
//     const [purchaseQuantities, setPurchaseQuantities] = useState({}); // New state for purchase quantities

//     useEffect(() => {
//         setLateCart(cart.filter(item => !item.isDeleted));
//         setDeletedId(cart.filter(item => item.isDeleted).map(item => item._id));

//         // Initialize purchase quantities
//         const initialQuantities = {};
//         cart.forEach(item => {
//             initialQuantities[item._id] = 1; // Default purchase quantity to 1
//         });
//         setPurchaseQuantities(initialQuantities);
//     }, [cart]);

//     useEffect(() => {
//         setTotalPrice(
//             lateCart.reduce((sum, item) => sum + (item.price * (purchaseQuantities[item._id] || 1)), 0).toFixed(2)
//         );
//         setTotalItems(lateCart.length);
//     }, [cart, lateCart, deletedId, purchaseQuantities]);

//     const handleBack = (productId) => {
//         const updatedDeletedId = deletedId.filter(dId => productId !== dId);
//         setDeletedId(updatedDeletedId);

//         const restoredProduct = cart.find(prod => prod._id === productId);
//         if (restoredProduct) {
//             setLateCart([...lateCart, restoredProduct]);
//         }

//         axiosFor.put(`/cart/${productId}/getback`, restoredProduct)
//             .then(res => {
//                 console.log(res.data);
//                 if (res.data.modifiedCount) {
//                     alert("Cart Updated: Product restored");
//                     refetch();
//                 }
//             });
//     };

//     const handleDelete = (productId) => {
//         setDeletedId([...deletedId, productId]);
//         const updatedLateCart = lateCart.filter(oneItem => oneItem._id !== productId);
//         setLateCart(updatedLateCart);

//         const deletedProduct = cart.find(item => item._id === productId);
//         axiosFor.put(`/cart/${productId}/delete`, deletedProduct)
//             .then(res => {
//                 console.log(res.data);
//                 if (res.data.modifiedCount) {
//                     alert("Cart Updated: Product deleted");
//                     refetch();
//                 }
//             });
//     };

//     const handlePayment = (del) => {
//         const ans = confirm("Do you want to proceed?");
//         if (ans) {
//             del.map(delId => {
//                 axiosFor.delete(`/cart/${delId}`)
//                     .then(res => {
//                         console.log(res);
//                         refetch();
//                     });
//             });
//         }
//     };

//     const handleIncrement = (productId) => {
//         const newPurchaseQuantities = { ...purchaseQuantities, [productId]: (purchaseQuantities[productId] || 1) + 1 };
//         setPurchaseQuantities(newPurchaseQuantities);
//     };

//     const handleDecrement = (productId) => {
//         if (purchaseQuantities[productId] > 1) {
//             const newPurchaseQuantities = { ...purchaseQuantities, [productId]: purchaseQuantities[productId] - 1 };
//             setPurchaseQuantities(newPurchaseQuantities);
//         }
//     };

//     return (
//         <div className="md:flex items-center gap-4 ml-4">
//             <Helmet>
//                 <title>My Carts</title>
//             </Helmet>
//             <div className="bg-yellow-200 p-4 rounded shadow-md mb-8 md:w-1/2">
//                 <h2 className="text-lg text-center font-semibold mb-0">Order Summary</h2>
//                 <div className="divider divider-info"></div>
//                 <div className="mb-4 flex sm:flex-col justify-between gap-1">
//                     <div className="flex justify-between md:text-2xl sm:text-lg">
//                         <p className="font-medium">Items:</p>
//                         <p className="font-medium ml-2">{totalItems}</p>
//                     </div>
//                     <div className="flex justify-between md:text-2xl sm:text-lg">
//                         <p className="font-medium">Total Price:</p>
//                         <p className="font-medium ml-2">${totalPrice}</p>
//                     </div>
//                     {
//                         lateCart.length > 0 && <button onClick={() => handlePayment(deletedId)} className="btn btn-primary font-semibold">Pay</button>
//                     }
//                 </div>
//             </div>
//             <div className="bg-yellow-200 p-12 mt-0 rounded shadow-md overflow-x-auto">
//                 {
//                     lateCart.length <= 0 && <button onClick={() => handlePayment(deletedId)} className="btn btn-primary text-lg font-semibold">Clear-Cart</button>
//                 }
//                 <h2 className="text-lg font-semibold mb-1 text-center">All Selected Products</h2>
//                 <div className="divider divider-info"></div>
//                 <table className="table-auto w-full">
//                     <thead>
//                         <tr>
//                             <th className="px-4 py-2 font-semibold">Name</th>
//                             <th className="px-4 py-2 font-semibold">Image</th>
//                             <th className="px-4 py-2 font-semibold">Price</th>
//                             <th className="px-4 py-2 font-semibold">Quantity</th>
//                             <th className="px-4 py-2 font-semibold">Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {cart.map(product => (
//                             <tr key={product._id}>
//                                 {product.product_name ? <td className="border px-4 py-2">{product.product_name}</td> : <td className="border px-4 py-2">{product.name}</td>}
//                                 <td className="border px-4 py-2"><img src={product.image} alt={product.product_name} style={{ width: '200px', height: '100px' }} /></td>
//                                 <td className="border px-4 py-2">${product.price}</td>
//                                 <td className="border px-4 py-2" style={{ minWidth: '200px' }}>
//                                     <div className="flex items-center justify-center">
//                                         <button onClick={() => handleDecrement(product._id)} className="btn btn-secondary" disabled={purchaseQuantities[product._id] <= 1 || deletedId.includes(product._id)}>-</button>
//                                         <span className="mx-2">{purchaseQuantities[product._id]}</span>
//                                         <button onClick={() => handleIncrement(product._id)} className="btn btn-secondary" disabled={purchaseQuantities[product._id] >= product.quantity || deletedId.includes(product._id)}>+</button>
//                                     </div>
//                                     <span className="mx-2 text-sm text-center text-red-500"> {product.quantity ? `(Not more than ${product.quantity})` : ''}</span>
//                                 </td>
//                                 <td className="border px-4 py-2">
//                                     {(deletedId.includes(product._id)) && (
//                                         <button
//                                             onClick={() => handleBack(product._id)}
//                                             className="btn btn-success text-white font-semibold"
//                                         >
//                                             Want Back?
//                                         </button>
//                                     )}
//                                     {
//                                         (deletedId.indexOf(product._id) === -1) && (
//                                             <button
//                                                 onClick={() => handleDelete(product._id)}
//                                                 className="btn btn-error font-semibold"
//                                                 disabled={deletedId.includes(product._id)}
//                                             >
//                                                 Delete
//                                             </button>
//                                         )}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// const Cart = () => {
//     const [cart, refetch] = useCart();
//     const axiosFor = useAxiosfor();
//     const [lateCart, setLateCart] = useState([]);
//     const [deletedId, setDeletedId] = useState([]);
//     const [totalPrice, setTotalPrice] = useState(0);
//     const [totalItems, setTotalItems] = useState(0);
//     const [purchaseQuantities, setPurchaseQuantities] = useState({});

//     useEffect(() => {
//         setLateCart(cart.filter(item => !item.isDeleted));
//         setDeletedId(cart.filter(item => item.isDeleted).map(item => item._id));

//         const initialQuantities = {};
//         cart.forEach(item => {
//             initialQuantities[item._id] = 1;
//         });
//         setPurchaseQuantities(initialQuantities);
//     }, [cart]);

//     useEffect(() => {
//         setTotalPrice(
//             lateCart.reduce((sum, item) => sum + (item.price * (purchaseQuantities[item._id] || 1)), 0).toFixed(2)
//         );
//         setTotalItems(lateCart.reduce((sum, item) => sum + (purchaseQuantities[item._id] || 1), 0));
//     }, [cart, lateCart, deletedId, purchaseQuantities]);

//     const handleBack = (productId) => {
//         const updatedDeletedId = deletedId.filter(dId => productId !== dId);
//         setDeletedId(updatedDeletedId);

//         const restoredProduct = cart.find(prod => prod._id === productId);
//         if (restoredProduct) {
//             setLateCart([...lateCart, restoredProduct]);
//         }

//         axiosFor.put(`/cart/${productId}/getback`, restoredProduct)
//             .then(res => {
//                 console.log(res.data);
//                 if (res.data.modifiedCount) {
//                     alert("Cart Updated: Product restored");
//                     refetch();
//                 }
//             });
//     };

//     const handleDelete = (productId) => {
//         setDeletedId([...deletedId, productId]);
//         const updatedLateCart = lateCart.filter(oneItem => oneItem._id !== productId);
//         setLateCart(updatedLateCart);

//         const deletedProduct = cart.find(item => item._id === productId);
//         axiosFor.put(`/cart/${productId}/delete`, deletedProduct)
//             .then(res => {
//                 console.log(res.data);
//                 if (res.data.modifiedCount) {
//                     alert("Cart Updated: Product deleted");
//                     refetch();
//                 }
//             });
//     };

//     const handlePayment = (del) => {
//         const ans = confirm("Do you want to proceed?");
//         if (ans) {
//             del.map(delId => {
//                 axiosFor.delete(`/cart/${delId}`)
//                     .then(res => {
//                         console.log(res);
//                         refetch();
//                     });
//             });
//         }
//     };

//     const handleIncrement = (productId) => {
//         const newPurchaseQuantities = { ...purchaseQuantities, [productId]: (purchaseQuantities[productId] || 1) + 1 };
//         setPurchaseQuantities(newPurchaseQuantities);
//     };

//     const handleDecrement = (productId) => {
//         if (purchaseQuantities[productId] > 1) {
//             const newPurchaseQuantities = { ...purchaseQuantities, [productId]: purchaseQuantities[productId] - 1 };
//             setPurchaseQuantities(newPurchaseQuantities);
//         }
//     };

//     return (
//         <div className="md:flex items-center gap-4 ml-4">
//             <Helmet>
//                 <title>My Carts</title>
//             </Helmet>
//             <div className="bg-yellow-200 p-4 rounded shadow-md mb-8 md:w-1/2">
//                 <h2 className="text-lg text-center font-semibold mb-0">Order Summary</h2>
//                 <div className="divider divider-info"></div>
//                 <div className="mb-4 flex sm:flex-col justify-between gap-1">
//                     <div className="flex justify-between md:text-2xl sm:text-lg">
//                         <p className="font-medium">Items:</p>
//                         <p className="font-medium ml-2">{totalItems}</p>
//                     </div>
//                     <div className="flex justify-between md:text-2xl sm:text-lg">
//                         <p className="font-medium">Total Price:</p>
//                         <p className="font-medium ml-2">${totalPrice}</p>
//                     </div>
//                     {
//                         lateCart.length > 0 && <button onClick={() => handlePayment(deletedId)} className="btn btn-primary font-semibold">Pay</button>
//                     }
//                 </div>
//             </div>
//             <div className="bg-yellow-200 p-12 mt-0 rounded shadow-md overflow-x-auto">
//                 {
//                     lateCart.length <= 0 && <button onClick={() => handlePayment(deletedId)} className="btn btn-primary text-lg font-semibold">Clear-Cart</button>
//                 }
//                 <h2 className="text-lg font-semibold mb-1 text-center">All Selected Products</h2>
//                 <div className="divider divider-info"></div>
//                 <table className="table-auto w-full">
//                     <thead>
//                         <tr>
//                             <th className="px-4 py-2 font-semibold">Name</th>
//                             <th className="px-4 py-2 font-semibold">Image</th>
//                             <th className="px-4 py-2 font-semibold">Price</th>
//                             <th className="px-4 py-2 font-semibold">Quantity</th>
//                             <th className="px-4 py-2 font-semibold">Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {cart.map(product => (
//                             <tr key={product._id}>
//                                 {product.product_name ? <td className="border px-4 py-2">{product.product_name}</td> : <td className="border px-4 py-2">{product.name}</td>}
//                                 <td className="border px-4 py-2"><img src={product.image} alt={product.product_name} style={{ width: '200px', height: '100px' }} /></td>
//                                 <td className="border px-4 py-2">${product.price}</td>
//                                 <td className="border px-4 py-2" style={{ minWidth: '200px' }}>
//                                     <div className="flex items-center justify-center">
//                                         <button onClick={() => handleDecrement(product._id)} className="btn btn-secondary" disabled={purchaseQuantities[product._id] <= 1 || deletedId.includes(product._id)}>-</button>
//                                         <span className="mx-2">{purchaseQuantities[product._id]}</span>
//                                         <button onClick={() => handleIncrement(product._id)} className="btn btn-secondary" disabled={purchaseQuantities[product._id] >= product.quantity || deletedId.includes(product._id)}>+</button>
//                                     </div>
//                                     <span className="mx-2 text-sm text-center text-red-500"> (Not more than {product.quantity})</span>
//                                 </td>
//                                 <td className="border px-4 py-2">
//                                     {(deletedId.includes(product._id)) && (
//                                         <button
//                                             onClick={() => handleBack(product._id)}
//                                             className="btn btn-success text-white font-semibold"
//                                         >
//                                             Want Back?
//                                         </button>
//                                     )}
//                                     {
//                                         (deletedId.indexOf(product._id) === -1) && (
//                                             <button
//                                                 onClick={() => handleDelete(product._id)}
//                                                 className="btn btn-error font-semibold"
//                                                 disabled={deletedId.includes(product._id)}
//                                             >
//                                                 Delete
//                                             </button>
//                                         )}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// const Cart = () => {
//     const [cart, refetch] = useCart();
//     // console.log(cart);
//     const axiosFor = useAxiosfor();
//     const [lateCart, setLateCart] = useState([]);
//     const [deletedId, setDeletedId] = useState([]);
//     const [totalPrice, setTotalPrice] = useState(0);
//     const [totalItems, setTotalItems] = useState(0);
//     const [purchaseQuantities, setPurchaseQuantities] = useState({});

//     useEffect(() => {
//         setLateCart(cart.filter(item => !item.isDeleted));
//         setDeletedId(cart.filter(item => item.isDeleted).map(item => item._id));

//         const initialQuantities = {};
//         cart.forEach(item => {
//             initialQuantities[item._id] = item.purchaseQuantity || 1;
//         });
//         setPurchaseQuantities(initialQuantities);
//     }, [cart]);

//     useEffect(() => {
//         setTotalPrice(
//             lateCart.reduce((sum, item) => sum + (item.price * (purchaseQuantities[item._id] || 1)), 0).toFixed(2)
//         );
//         setTotalItems(lateCart.reduce((sum, item) => sum + (purchaseQuantities[item._id] || 1), 0));
//     }, [cart, lateCart, deletedId, purchaseQuantities]);

//     const handleBack = (productId) => {
//         const updatedDeletedId = deletedId.filter(dId => productId !== dId);
//         setDeletedId(updatedDeletedId);

//         const restoredProduct = cart.find(prod => prod._id === productId);
//         if (restoredProduct) {
//             setLateCart([...lateCart, restoredProduct]);
//         }

//         axiosFor.put(`/cart/${productId}/getback`, restoredProduct)
//             .then(res => {
//                 console.log(res.data);
//                 if (res.data.modifiedCount) {
//                     alert("Cart Updated: Product restored");
//                     refetch();
//                 }
//             });
//     };

//     const handleDelete = (productId) => {
//         setDeletedId([...deletedId, productId]);
//         const updatedLateCart = lateCart.filter(oneItem => oneItem._id !== productId);
//         setLateCart(updatedLateCart);

//         const deletedProduct = cart.find(item => item._id === productId);
//         axiosFor.put(`/cart/${productId}/delete`, deletedProduct)
//             .then(res => {
//                 console.log(res.data);
//                 if (res.data.modifiedCount) {
//                     alert("Cart Updated: Product deleted");
//                     refetch();
//                 }
//             });
//     };

//     const handlePayment = (del) => {
//         const ans = confirm("Do you want to proceed?");
//         if (ans) {
//             del.map(delId => {
//                 axiosFor.delete(`/cart/${delId}`)
//                     .then(res => {
//                         console.log(res);
//                         refetch();
//                     });
//             });
//         }
//     };

//     const handleIncrement = (productId) => {
//         const newPurchaseQuantities = { ...purchaseQuantities, [productId]: (purchaseQuantities[productId] || 1) + 1 };
//         console.log(newPurchaseQuantities);
//         setPurchaseQuantities(newPurchaseQuantities);
//         axiosFor.put(`/cart/${productId}/update-quantity`, { quantity: newPurchaseQuantities[productId] })
//             .then(res => {
//                 console.log(res.data);
//             });
//     };

//     const handleDecrement = (productId) => {
//         if (purchaseQuantities[productId] > 1) {
//             const newPurchaseQuantities = { ...purchaseQuantities, [productId]: purchaseQuantities[productId] - 1 };
//             setPurchaseQuantities(newPurchaseQuantities);
//             axiosFor.put(`/cart/${productId}/update-quantity`, { quantity: newPurchaseQuantities[productId] })
//                 .then(res => {
//                     console.log(res.data);
//                 });
//         }
//     };

//     return (
//         <div className="md:flex items-center gap-4 ml-4">
//             <Helmet>
//                 <title>My Carts</title>
//             </Helmet>
//             <div className="bg-yellow-200 p-4 rounded shadow-md mb-8 md:w-1/2">
//                 <h2 className="text-lg text-center font-semibold mb-0">Order Summary</h2>
//                 <div className="divider divider-info"></div>
//                 <div className="mb-4 flex sm:flex-col justify-between gap-1">
//                     <div className="flex justify-between md:text-2xl sm:text-lg">
//                         <p className="font-medium">Items:</p>
//                         <p className="font-medium ml-2">{totalItems}</p>
//                     </div>
//                     <div className="flex justify-between md:text-2xl sm:text-lg">
//                         <p className="font-medium">Total Price:</p>
//                         <p className="font-medium ml-2">${totalPrice}</p>
//                     </div>
//                     {
//                         lateCart.length > 0 && <button onClick={() => handlePayment(deletedId)} className="btn btn-primary font-semibold">Pay</button>
//                     }
//                 </div>
//             </div>
//             <div className="bg-yellow-200 p-12 mt-0 rounded shadow-md overflow-x-auto">
//                 {
//                     lateCart.length <= 0 && <button onClick={() => handlePayment(deletedId)} className="btn btn-primary text-lg font-semibold">Clear-Cart</button>
//                 }
//                 <h2 className="text-lg font-semibold mb-1 text-center">All Selected Products</h2>
//                 <div className="divider divider-info"></div>
//                 <table className="table-auto w-full">
//                     <thead>
//                         <tr>
//                             <th className="px-4 py-2 font-semibold">Name</th>
//                             <th className="px-4 py-2 font-semibold">Image</th>
//                             <th className="px-4 py-2 font-semibold">Price</th>
//                             <th className="px-4 py-2 font-semibold">Quantity</th>
//                             <th className="px-4 py-2 font-semibold">Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {cart.map(product => (
//                             <tr key={product._id}>
//                                 {product.product_name ? <td className="border px-4 py-2">{product.product_name}</td> : <td className="border px-4 py-2">{product.name}</td>}
//                                 <td className="border px-4 py-2"><img src={product.image} alt={product.product_name} style={{ width: '200px', height: '100px' }} /></td>
//                                 <td className="border px-4 py-2">${product.price}</td>
//                                 <td className="border px-4 py-2" style={{ minWidth: '200px' }}>
//                                     <div className="flex items-center justify-center">
//                                         <button onClick={() => handleDecrement(product._id)} className="btn btn-secondary" disabled={purchaseQuantities[product._id] <= 1 || deletedId.includes(product._id)}>-</button>
//                                         <span className="mx-2">{purchaseQuantities[product._id]}</span>
//                                         <button onClick={() => handleIncrement(product._id)} className="btn btn-secondary" disabled={purchaseQuantities[product._id] >= product.quantity || deletedId.includes(product._id)}>+</button>
//                                     </div>
//                                     <span className="mx-2 text-sm text-center text-red-500"> {product.quantity ? `(Not more than ${product.quantity})` : ''}</span>
//                                 </td>
//                                 <td className="border px-4 py-2">
//                                     {(deletedId.includes(product._id)) && (
//                                         <button
//                                             onClick={() => handleBack(product._id)}
//                                             className="btn btn-success text-white font-semibold"
//                                         >
//                                             Want Back?
//                                         </button>
//                                     )}
//                                     {
//                                         (deletedId.indexOf(product._id) === -1) && (
//                                             <button
//                                                 onClick={() => handleDelete(product._id)}
//                                                 className="btn btn-error font-semibold"
//                                                 disabled={deletedId.includes(product._id)}
//                                             >
//                                                 Delete
//                                             </button>
//                                         )}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// const Cart = () => {
//     const [cart, refetch] = useCart();
//     const axiosFor = useAxiosfor();
//     const [lateCart, setLateCart] = useState([]);
//     const [deletedId, setDeletedId] = useState([]);
//     const [totalPrice, setTotalPrice] = useState(0);
//     const [totalItems, setTotalItems] = useState(0);
//     const [purchaseQuantities, setPurchaseQuantities] = useState({});

//     useEffect(() => {
//         setLateCart(cart.filter(item => !item.isDeleted));
//         setDeletedId(cart.filter(item => item.isDeleted).map(item => item._id));

//         const initialQuantities = {};
//         cart.forEach(item => {
//             initialQuantities[item._id] = item.purchaseQuantity || 1;
//         });
//         setPurchaseQuantities(initialQuantities);
//     }, [cart]);

//     useEffect(() => {
//         setTotalPrice(
//             lateCart.reduce((sum, item) => sum + (item.price * (purchaseQuantities[item._id] || 1)), 0).toFixed(2)
//         );
//         setTotalItems(lateCart.reduce((sum, item) => sum + (purchaseQuantities[item._id] || 1), 0));
//     }, [cart, lateCart, deletedId, purchaseQuantities]);

//     const handleBack = (productId) => {
//         const updatedDeletedId = deletedId.filter(dId => productId !== dId);
//         setDeletedId(updatedDeletedId);

//         const restoredProduct = cart.find(prod => prod._id === productId);
//         if (restoredProduct) {
//             setLateCart([...lateCart, restoredProduct]);
//         }

//         axiosFor.put(`/cart/${productId}/getback`, restoredProduct)
//             .then(res => {
//                 if (res.data.modifiedCount) {
//                     alert("Cart Updated: Product restored");
//                     refetch();
//                 }
//             });
//     };

//     const handleDelete = (productId) => {
//         setDeletedId([...deletedId, productId]);
//         setLateCart(lateCart.filter(oneItem => oneItem._id !== productId));

//         const deletedProduct = cart.find(item => item._id === productId);
//         axiosFor.put(`/cart/${productId}/delete`, deletedProduct)
//             .then(res => {
//                 if (res.data.modifiedCount) {
//                     alert("Cart Updated: Product deleted");
//                     refetch();
//                 }
//             });
//     };

//     const handlePayment = (del) => {
//         if (confirm("Do you want to proceed?")) {
//             del.forEach(delId => {
//                 axiosFor.delete(`/cart/${delId}`)
//                     .then(() => {
//                         refetch();
//                     });
//             });
//         }
//     };

//     const handleIncrement = (productId) => {
//         const newQuantities = { ...purchaseQuantities, [productId]: (purchaseQuantities[productId] || 1) + 1 };
//         setPurchaseQuantities(newQuantities);
//         axiosFor.put(`/cart/${productId}/update-quantity`, { quantity: newQuantities[productId] })
//             .then(res => console.log(res.data));
//     };

//     const handleDecrement = (productId) => {
//         if (purchaseQuantities[productId] > 1) {
//             const newQuantities = { ...purchaseQuantities, [productId]: purchaseQuantities[productId] - 1 };
//             setPurchaseQuantities(newQuantities);
//             axiosFor.put(`/cart/${productId}/update-quantity`, { quantity: newQuantities[productId] })
//                 .then(res => console.log(res.data));
//         }
//     };

//     return (
//         <div className="md:flex items-center gap-4 ml-4">
//             <Helmet>
//                 <title>My Carts</title>
//             </Helmet>
//             <div className="bg-yellow-200 p-4 rounded shadow-md mb-8 md:w-1/2">
//                 <h2 className="text-lg text-center font-semibold mb-0">Order Summary</h2>
//                 <div className="divider divider-info"></div>
//                 <div className="mb-4 flex sm:flex-col justify-between gap-1">
//                     <div className="flex justify-between md:text-2xl sm:text-lg">
//                         <p className="font-medium">Items:</p>
//                         <p className="font-medium ml-2">{totalItems}</p>
//                     </div>
//                     <div className="flex justify-between md:text-2xl sm:text-lg">
//                         <p className="font-medium">Total Price:</p>
//                         <p className="font-medium ml-2">${totalPrice}</p>
//                     </div>
//                     {lateCart.length > 0 && (
//                         <button onClick={() => handlePayment(deletedId)} className="btn btn-primary font-semibold">
//                             Pay
//                         </button>
//                     )}
//                 </div>
//             </div>
//             <div className="bg-yellow-200 p-12 mt-0 rounded shadow-md overflow-x-auto">
//                 {lateCart.length <= 0 && (
//                     <button onClick={() => handlePayment(deletedId)} className="btn btn-primary text-lg font-semibold">
//                         Clear-Cart
//                     </button>
//                 )}
//                 <h2 className="text-lg font-semibold mb-1 text-center">All Selected Products</h2>
//                 <div className="divider divider-info"></div>
//                 <table className="table-auto w-full">
//                     <thead>
//                         <tr>
//                             <th className="px-4 py-2 font-semibold">Name</th>
//                             <th className="px-4 py-2 font-semibold">Image</th>
//                             <th className="px-4 py-2 font-semibold">Price</th>
//                             <th className="px-4 py-2 font-semibold">Quantity</th>
//                             <th className="px-4 py-2 font-semibold">Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {cart.map(product => (
//                             <tr key={product._id}>
//                                 <td className="border px-4 py-2">{product.product_name || product.name}</td>
//                                 <td className="border px-4 py-2">
//                                     <img src={product.image} alt={product.product_name} style={{ width: '200px', height: '100px' }} />
//                                 </td>
//                                 <td className="border px-4 py-2">${product.price}</td>
//                                 <td className="border px-4 py-2" style={{ minWidth: '200px' }}>
//                                     <div className="flex items-center justify-center">
//                                         <button
//                                             onClick={() => handleDecrement(product._id)}
//                                             className="btn btn-secondary"
//                                             disabled={purchaseQuantities[product._id] <= 1 || deletedId.includes(product._id)}
//                                         >
//                                             -
//                                         </button>
//                                         <span className="mx-2">{purchaseQuantities[product._id]}</span>
//                                         <button
//                                             onClick={() => handleIncrement(product._id)}
//                                             className="btn btn-secondary"
//                                             disabled={purchaseQuantities[product._id] >= product.quantity || deletedId.includes(product._id)}
//                                         >
//                                             +
//                                         </button>
//                                     </div>
//                                     {product.quantity && (
//                                         <span className="mx-2 text-sm text-center text-red-500">
//                                             (Not more than {product.quantity})
//                                         </span>
//                                     )}
//                                 </td>
//                                 <td className="border px-4 py-2">
//                                     {deletedId.includes(product._id) ? (
//                                         <button
//                                             onClick={() => handleBack(product._id)}
//                                             className="btn btn-success text-white font-semibold"
//                                         >
//                                             Back?
//                                         </button>
//                                     ) : (
//                                         <button
//                                             onClick={() => handleDelete(product._id)}
//                                             className="btn btn-error font-semibold"
//                                             disabled={deletedId.includes(product._id)}
//                                         >
//                                             X
//                                         </button>
//                                     )}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

