import { useState } from 'react';
import styles from './Invoice.module.css';
import useCart from '../../../../hooks/useCart';
import useAxiosfor from '../../../../hooks/useAxiosfor';
import { useNavigate } from 'react-router-dom';


const Invoice = ({ mail, name, totalPrice }) => {
  const [cart, refetch] = useCart();
  const axiosFor=useAxiosfor();
  const Navigate=useNavigate();
  const newCart = cart.filter(item => item.isDeleted !== true);

  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  const handleSubmit = async () => {
    const order = {
      name,
      email_owner:mail,
      address_owner:address,
      contactNumber,
      cart: newCart,
      totalPrice,
      // isCompleted: false,
    };

    try {
      const response = await axiosFor.post('/orders', order);
      console.log(response.data);
      // Navigate(response.data.url);
      window.location.replace(response.data.url);
    } catch (error) {
      console.error('Error posting order:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>Customer Details</h3>
      <p className={styles.detail}><strong>Name:</strong> {name}</p>
      <p className={styles.detail}><strong>Email:</strong> {mail}</p>

      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>Address:</label>
        <input
          type="text"
          className={styles.inputField}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>Contact Number:</label>
        <input
          type="text"
          className={styles.inputField}
          value={contactNumber}
          placeholder='Must provide contact number'
          onChange={(e) => setContactNumber(e.target.value)}
        />
      </div>

      <h3 className={styles.header}>Purchase Details</h3>
      <ul className={styles.list}>
        {newCart.map((element, index) => (
          <li key={index} className={styles.listItem}>
            {element?.product_name} - {element?.purchaseQuantity}
          </li>
        ))}
      </ul>

      <h3 className={styles.header}>Total Price</h3>
      <p className={styles.totalPrice}>{totalPrice.toFixed(2)}</p>

      <button onClick={handleSubmit} className={styles.submitButton}>
        Submit Order
      </button>
    </div>
  );
};


// Invoice.propTypes = {
//     mail: PropTypes.string.isRequired,
//     name: PropTypes.string.isRequired,
//     totalPrice: PropTypes.number.isRequired,
//     purchaseQuantities: PropTypes.object.isRequired,
// };

export default Invoice;
