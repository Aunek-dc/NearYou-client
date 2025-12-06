import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../Context Providers/AuthProvider';
import useAxiosfor from '../../../hooks/useAxiosfor';

const PurchaseHistory = () => {
    const { user } = useContext(AuthContext);
    // const [email, setEmail] = useState(user.email);
    // console.log(user);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const AxiosFor=useAxiosfor();
  
    useEffect(() => {
      const fetchOrders = async () => {
        if (!user.email) {
          setOrders([]);
          return;
        }
    
        try {
          const response = await AxiosFor(`/orders/${user.email}`);
          // console.log(response);
    
          if (response.status !== 200) {
            throw new Error('Network response was not ok');
          }
    
          const data = response.data;
          // console.log(data);
          setOrders(data);
          setError('');
        } catch (error) {
          setError('Error fetching orders: ' + error.message);
          setOrders([]);
        }
      };
    
      fetchOrders();
    }, [user]);
    
  
    return (
        <div>
          {/* <h1>Get Orders by Email</h1> */}
          {error && <p>{error}</p>}
          <ul>
            {orders?.map((order) => (
              <li key={order._id}>
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Name:</strong> {order.name}</p>
                <p><strong>Email:</strong> {order.email_owner}</p>
                <p><strong>Address:</strong> {order.address_owner}</p>
                <p><strong>Contact Number:</strong> {order.contactNumber}</p>
                <p><strong>Total Price:</strong> {order.totalPrice}</p>
                <p><strong>Is Completed:</strong> {order.isCompleted ? 'Yes' : 'No'}</p>
                <ul>
                  {order.cart.map((item) => (
                    <li key={item._id}>
                      <p><strong>Product Name:</strong> {item.product_name}</p>
                      <p><strong>Price:</strong> {item.price}</p>
                      <p><strong>Quantity:</strong> {item.quantity}</p>
                      <p><strong>Category:</strong> {item.category}</p>
                      <p><strong>Image:</strong> <img src={item.image} alt={item.product_name} width="100" /></p>
                      <p><strong>Details:</strong> {item.details}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      );
  };

export default PurchaseHistory;