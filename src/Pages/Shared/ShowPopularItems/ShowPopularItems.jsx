

import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import useAxiosfor from "../../../hooks/useAxiosfor";
import useCart from "../../../hooks/useCart";
import '../Distance Show/Distance.css';

const ShowPopularItems = ({ product }) => {
  const { image, product_name, details, price } = product;
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosFor = useAxiosfor();
  const [, refetch] = useCart();

  const [showFullDetails, setShowFullDetails] = useState(false);
  const [enlarged, setEnlarged] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const imgRef = useRef(null);
  const clickTimeoutRef = useRef(null);
  const [showDoubleClickMessage, setShowDoubleClickMessage] = useState(false);

  // const handleAddtoCart = cardSelected => {
  //   if (user && user.email) {
  //     const cartItem = {
  //       buyerProductID: _id,
  //       name: cardSelected.product_name,
  //       image: cardSelected.image,
  //       email: user.email,
  //       price,
  //       isDeleted: false
  //     };
  //     axiosFor.post("/cart", cartItem)
  //       .then(res => {
  //         if (res.data.insertedId) {
  //           alert("Cart added");
  //         }
  //         refetch();
  //       });
  //   } else {
  //     alert("Please, log in.");
  //     navigate('/login', { state: { from: location } });
  //   }
  //   return;
  // };

  const handleAddtoCart = (cardSelected) => {
    if (user && user.email) {
      const cartItem = {
        ...cardSelected,
        purchaseQuantity: 1,
        email: user.email,
        isDeleted: false
      };
      axiosFor.post("/cart", cartItem)
        .then(res => {
          if (res.data.insertedId) {
            // alert("Cart added");
          }
          refetch();
        });
    } else {
      alert("Please, log in.");
      navigate('/login', { state: { from: location } });
    }
  };
  
  const truncateText = (text, length) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  const handleSingleClick = () => {
    if (enlarged) {
      setEnlarged(false);
    }
  };

  const handleDoubleClick = () => {
    setEnlarged(true);
    setShowDoubleClickMessage(true);
    setTimeout(() => {
      setShowDoubleClickMessage(false);
    }, 2000); // Hide double click message after 2 seconds
  };

  const handleClick = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      handleDoubleClick();
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        handleSingleClick();
        clickTimeoutRef.current = null;
      }, 300);
    }
  };

  const handleMouseMove = (e) => {
    if (enlarged) {
      const rect = imgRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - rect.width / 2;
      const offsetY = e.clientY - rect.top - rect.height / 2;
      setPosition({ top: offsetY, left: offsetX });
    }
  };

  useEffect(() => {
    if (enlarged) {
      imgRef.current.style.width = '100%';
      imgRef.current.style.height = '100%';
      imgRef.current.style.objectFit = 'cover';
      imgRef.current.style.transition = 'top 0.5s, left 0.5s';
      imgRef.current.parentElement.style.height = '100%';
      imgRef.current.parentElement.style.zIndex = '10';
    } else {
      imgRef.current.style.width = 'auto';
      imgRef.current.style.height = 'auto';
      imgRef.current.style.transition = 'none';
      imgRef.current.parentElement.style.height = '12rem'; // equivalent to h-48
      imgRef.current.parentElement.style.zIndex = '0';
      setPosition({ top: 0, left: 0 });
    }
  }, [enlarged]);

  return (
    <div 
      className={`max-w-sm mx-auto bg-blue-50 rounded-lg shadow-lg overflow-hidden my-6 flex flex-col transition-transform transform ${enlarged ? '' : 'hover:scale-105 hover:shadow-2xl'}`}
      onMouseMove={handleMouseMove}
    >
      <div 
        className="overflow-hidden relative h-48 cursor-pointer" 
        onClick={handleClick}
        onMouseEnter={() => setShowDoubleClickMessage(false)}
        onMouseLeave={() => setShowDoubleClickMessage(true)}
        style={{ zIndex: enlarged ? '10' : '0', position: enlarged ? 'absolute' : 'relative', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <img 
          ref={imgRef}
          className="absolute object-cover transition-transform transform w-full h-full" 
          src={image} 
          alt={product_name}
          style={{ top: `${position.top}px`, left: `${position.left}px`, transition: 'top 0.5s, left 0.5s' }}
        />
        {!enlarged && showDoubleClickMessage && (
          <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center p-2 opacity-100">
            Double-click to enlarge the image.
          </div>
        )}
      </div>
      <div className={`p-6 flex flex-col flex-grow transition-opacity ${enlarged ? 'opacity-0' : 'opacity-100'}`}>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{product_name}</h2>
        <p className="text-gray-800 mb-4">
          {showFullDetails ? details : truncateText(details, 100)}
        </p>
        <p className="distance-text text-3xl">{'BDT ' + price}</p>
        <div className="mt-auto flex space-x-4">
          <button 
            onClick={() => setShowFullDetails(!showFullDetails)} 
            className="w-full px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
          >
            {showFullDetails ? 'Show less' : 'Details'}
          </button>
          <button 
            onClick={() => handleAddtoCart(product)} 
            className="w-full px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowPopularItems;

