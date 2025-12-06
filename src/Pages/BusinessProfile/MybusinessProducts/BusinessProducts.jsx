import { useEffect, useState } from 'react';
import './BusinessProducts.css';
import useAuth from '../../../hooks/useAuth';
import useAxiosfor from '../../../hooks/useAxiosfor';
import { Helmet } from 'react-helmet-async';
import LoadingSpinner from "../../../Shared Components/Spinner/LoadingSpinner";

const BusinessProducts = () => {
    const axiosFor = useAxiosfor();
    const { uid: userId } = useAuth().user;

    const [businessProfile, setBusinessProfile] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [addFormData, setAddFormData] = useState({
        product_name: '',
        price: '',
        category: '',
        quantity: '',
        popular: false,
        image: '',
        details: '',
    });
    const [editFormData, setEditFormData] = useState({
        product_name: '',
        price: '',
        category: '',
        quantity: '',
        popular: false,
        image: '',
        details: '',
    });
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [visibleDetails, setVisibleDetails] = useState(null);

    const handleDetailsClick = (productId) => {
        setVisibleDetails(visibleDetails === productId ? null : productId);
    };

    useEffect(() => {
        fetchBusinessProfile();
    }, []);

    const fetchBusinessProfile = async () => {
        setLoading(true);
        try {
            const response = await axiosFor.get(`/products?userId=${userId}`);
            setBusinessProfile(response.data);
        } catch (error) {
            console.error('Error fetching business profile:', error);
            setBusinessProfile(null);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (product) => {
        if (editingProduct?.id === product.id) {
            setIsEditDrawerOpen(false);
            setEditingProduct(null);
        } else {
            setEditingProduct(product);
            setEditFormData({
                product_name: product.product_name,
                price: product.price,
                category: product.category,
                quantity: product.quantity,
                popular: product.popular,
                image: product.image,
                details: product.details,
            });
            setIsEditDrawerOpen(true);
            setIsDrawerOpen(false); // Close add form if open
        }
    };

    const handleInputChange = (e, formDataSetter) => {
        const { name, value, type, checked } = e.target;
        formDataSetter(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newProduct = {
                ...addFormData,
                price: parseFloat(addFormData.price),
                category: addFormData.category,
                quantity: parseInt(addFormData.quantity),
                popular: addFormData.popular,
                image: addFormData.image,
                details: addFormData.details,
                userId: userId
            };

            await axiosFor.post(`/addproducts`, newProduct);
            fetchBusinessProfile();
            setAddFormData({
                product_name: '',
                price: '',
                category: '',
                quantity: '',
                popular: false,
                image: '',
                details: '',
            });
            setIsDrawerOpen(false);
            setMessage('Product added successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error adding product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedProduct = {
                ...editFormData,
                price: parseFloat(editFormData.price),
                quantity: parseInt(editFormData.quantity),
                popular: editFormData.popular,
                userId: userId
            };

            await axiosFor.put(`/products/${editingProduct.id}`, updatedProduct);
            fetchBusinessProfile();
            setEditingProduct(null);
            setEditFormData({
                product_name: '',
                price: '',
                category: '',
                quantity: '',
                popular: false,
                image: '',
                details: '',
            });
            setIsEditDrawerOpen(false);
            setMessage('Product updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error updating product:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="business-products">
            <Helmet>
                <title>Business Products</title>
            </Helmet>
            <button
                onClick={() => {
                    setIsDrawerOpen(!isDrawerOpen);
                    setIsEditDrawerOpen(false); // Close edit form if open
                    setEditingProduct(null); // Reset editing product
                }}
                className="drawer-toggle-btn"
            >
                {isDrawerOpen ? 'Close Form' : 'Add Product'}
            </button>
            {message && <div className="message">{message}</div>}
            {loading && <LoadingSpinner />}

            <div className="content-container">
                <div className="product-list-column">
                    <h1 className="text-center">My Products</h1>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {businessProfile && businessProfile[0]?.products?.map(product => (
                            <li key={product.id} className="border p-4 list-none ">
                                <h2 className="text-xl font-bold">{product.product_name}</h2>
                                <p>Price: {product.price}</p>
                                <p>Category: {product.category}</p>
                                <p>Quantity: {product.quantity}</p>
                                <p>Popular: {product.popular ? 'Yes' : 'No'}</p>
                                {product.image && (
                                    <img src={product.image} alt={product.product_name} className="w-full h-auto mt-2" />
                                )}
                                {visibleDetails === product.id && (
                                    <p>Details: {product.details}</p>
                                )}
                                <button
                                    onClick={() => handleDetailsClick(product.id)}
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                                >
                                    {visibleDetails === product.id ? 'Hide Details' : 'Show Details'}
                                </button>
                                <button
                                    onClick={() => handleEditClick(product)}
                                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 ml-2"
                                >
                                    {editingProduct?.id === product.id ? 'Close' : 'Edit'}
                                </button>
                            </li>
                        ))}
                    </ul>

                </div>
            </div>

            {isDrawerOpen && (
                <div className="drawer add-drawer">
                    <form className="product-form" onSubmit={handleAddFormSubmit}>
                        <div className="form-group">
                            <label>Product Name:</label>
                            <input
                                type="text"
                                name="product_name"
                                value={addFormData.product_name}
                                onChange={(e) => handleInputChange(e, setAddFormData)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Price:</label>
                            <input
                                type="number"
                                name="price"
                                value={addFormData.price}
                                onChange={(e) => handleInputChange(e, setAddFormData)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Category:</label>
                            <input
                                type="text"
                                name="category"
                                value={addFormData.category}
                                onChange={(e) => handleInputChange(e, setAddFormData)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Quantity:</label>
                            <input
                                type="number"
                                name="quantity"
                                value={addFormData.quantity}
                                onChange={(e) => handleInputChange(e, setAddFormData)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Popular:</label>
                            <input
                                type="checkbox"
                                name="popular"
                                checked={addFormData.popular}
                                onChange={(e) => handleInputChange(e, setAddFormData)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Image URL:</label>
                            <input
                                type="text"
                                name="image"
                                value={addFormData.image}
                                onChange={(e) => handleInputChange(e, setAddFormData)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Details:</label>
                            <textarea
                                name="details"
                                value={addFormData.details}
                                onChange={(e) => handleInputChange(e, setAddFormData)}
                            />
                        </div>
                        <button type="submit">Add Product</button>
                    </form>
                </div>
            )}

            {isEditDrawerOpen && (
                <div className="drawer edit-drawer">
                    <form className="product-form" onSubmit={handleEditFormSubmit}>
                        <div className="form-group">
                            <label>Product Name:</label>
                            <input
                                type="text"
                                name="product_name"
                                value={editFormData.product_name}
                                onChange={(e) => handleInputChange(e, setEditFormData)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Price:</label>
                            <input
                                type="number"
                                name="price"
                                value={editFormData.price}
                                onChange={(e) => handleInputChange(e, setEditFormData)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Category:</label>
                            <input
                                type="text"
                                name="category"
                                value={editFormData.category}
                                onChange={(e) => handleInputChange(e, setEditFormData)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Quantity:</label>
                            <input
                                type="number"
                                name="quantity"
                                value={editFormData.quantity}
                                onChange={(e) => handleInputChange(e, setEditFormData)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Popular:</label>
                            <input
                                type="checkbox"
                                name="popular"
                                checked={editFormData.popular}
                                onChange={(e) => handleInputChange(e, setEditFormData)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Image URL:</label>
                            <input
                                type="text"
                                name="image"
                                value={editFormData.image}
                                onChange={(e) => handleInputChange(e, setEditFormData)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Details:</label>
                            <textarea
                                name="details"
                                value={editFormData.details}
                                onChange={(e) => handleInputChange(e, setEditFormData)}
                            />
                        </div>
                        <button type="submit">Update Product</button>
                    </form>
                </div>
            )}
        </div>
    );
};



export default BusinessProducts;
