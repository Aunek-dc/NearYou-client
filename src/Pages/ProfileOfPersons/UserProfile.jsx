// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom'; // Assuming you use React Router for navigation
// import useAuth from '../../hooks/useAuth';
// import useAxiosfor from '../../hooks/useAxiosfor';
// import LoadingSpinner from '../../Shared Components/Spinner/LoadingSpinner'; // Assume LoadingSpinner component for better user experience

// const UserProfile = () => {
//   const { user } = useAuth();
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const axiosfor = useAxiosfor();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         if (user && user.uid) {

//           const response = await axiosfor.get(`/users/${user.uid}`); // Adjust endpoint based on your API
//           setUserData(response.data);
//         } else {
//           throw new Error('User or uid is missing');
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//         setError('Error fetching user data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user && user.uid) {
//       fetchUserData();
//     } else {
//       setLoading(false);
//     }
//   }, [user, axiosfor]);

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-100">
//         <div className="bg-white p-8 rounded-lg shadow-lg text-center">
//           <h1 className="text-2xl font-semibold mb-4">Error</h1>
//           <p className="text-red-600">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (!userData) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-100">
//         <div className="bg-white p-8 rounded-lg shadow-lg text-center">
//           <h1 className="text-2xl font-semibold mb-4">No User Data Found</h1>
//           <p className="text-gray-600">Please check back later or contact support.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg text-center">
//         <img 
//           src={userData.photourl} 
//           alt={`${userData.name}'s profile`} 
//           className="rounded-full w-32 h-32 mx-auto mb-4"
//         />
//         <h1 className="text-2xl font-semibold mb-2">{userData.name}</h1>
//         <p className="text-gray-600 mb-4">{userData.email}</p>
//         <Link to="/edit-profile" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">
//           Edit Profile
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;

import { useEffect, useState } from 'react';
import './UserProfile.css'; // Assuming you have a CSS file for styling
import { Helmet } from 'react-helmet-async';
import useAxiosfor from '../../hooks/useAxiosfor';
import useAuth from '../../hooks/useAuth';
// import { Link } from 'react-router-dom'; // Assuming you use React Router for navigation
// import useAuth from '../../hooks/useAuth';
// import useAxiosfor from '../../hooks/useAxiosfor';
import LoadingSpinner from '../../Shared Components/Spinner/LoadingSpinner'; // Adjust path as per your project structure

const UserProfile = () => {
  const axiosFor = useAxiosfor(); // Custom hook for Axios instance
  const auth = useAuth();
  const userId = auth.user ? auth.user.uid : null; // Ensure user object is not null
  // console.log(auth);
  const [userData, setUserData] = useState(null); // State for user data
  const [editMode, setEditMode] = useState(false); // State for edit mode
  const [editFormData, setEditFormData] = useState({
    name: '',
    photourl: '',
    email: '',
    contactNumber: '',
    facebookLink: '',
    bio: '',
    location: '',
    interests: '',
  });
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error message
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  useEffect(() => {
    if (userId) {
      fetchUserData(); // Fetch user data if userId is available
    } else {
      setLoading(false); // If no userId, stop loading state
    }
  }, [userId]); // Only fetch user data when userId changes

  // Function to fetch user data
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await axiosFor.get(`/users/${userId}`); // Adjust endpoint as per your API
      setUserData(response.data); // Set user data from response
      setEditFormData({
        name: response.data.name,
        photourl: response.data.photourl,
        email: response.data.email,
        contactNumber: response.data.contactNumber || '',
        facebookLink: response.data.facebookLink || '',
        bio: response.data.bio || '',
        location: response.data.location || '',
        interests: response.data.interests || '',
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Error fetching user data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle input changes in edit mode
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // Function to handle edit form submission
  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUserData = {
        ...editFormData,
        // You might want to add more fields here if needed
      };
      await axiosFor.put(`/users/${userId}`, updatedUserData); // Adjust endpoint as per your API
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setEditMode(false); // Exit edit mode after successful update
      fetchUserData(); // Refresh user data after update
    } catch (error) {
      console.error('Error updating user profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle canceling edit mode
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditFormData({
      name: userData.name,
      photourl: userData.photourl,
      email: userData.email,
      contactNumber: userData.contactNumber || '',
      facebookLink: userData.facebookLink || '',
      bio: userData.bio || '',
      location: userData.location || '',
      interests: userData.interests || '',
    });
  };

  // Handle case where auth.user is null or not yet loaded
  if (!auth.user) {
    return (
      <div className="user-profile">
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Render error message if there's an error
  if (error) {
    return (
      <div className="user-profile">
        {/* <Helmet>
          <title>User Profile</title>
        </Helmet> */}
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h1 className="text-2xl font-semibold mb-4">Error</h1>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Render user profile once data is loaded
  return (
    <div className="user-profile">
      {loading && <LoadingSpinner />}
      {!loading && userData &&(<Helmet>
        <title>{userData.name} Profile</title>
      </Helmet>)}
      <div className="profile-container">
        {loading && <LoadingSpinner />}
        {!loading && userData && (
          <div className="profile-details">
            <div className="profile-info">
              <img
                src={userData.photourl}
                alt={`${userData.name}'s profile`}
                className="rounded-full w-32 h-32 mx-auto mb-4"
              />
              <h1 className="text-2xl font-semibold mb-2">{userData.name}</h1>
              <p className="text-gray-600 mb-4">{userData.email}</p>
              {userData.contactNumber && (
                <p className="text-gray-600 mb-4">Contact: {userData.contactNumber}</p>
              )}
              {userData.facebookLink && (
                <p className="text-gray-600 mb-4">
                  Facebook: <a href={userData.facebookLink}>{userData.facebookLink}</a>
                </p>
              )}
              {!editMode && (
                <button className="edit-profile-button" onClick={() => setEditMode(true)}>
                  Edit Profile
                </button>
              )}
            </div>
            {editMode && (
              <div className="edit-profile-form">
                <form onSubmit={handleEditFormSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editFormData.name}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="photourl">Photo URL:</label>
                    <input
                      type="text"
                      id="photourl"
                      name="photourl"
                      value={editFormData.photourl}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contactNumber">Contact Number:</label>
                    <input
                      type="tel"
                      id="contactNumber"
                      name="contactNumber"
                      value={editFormData.contactNumber}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="facebookLink">Facebook Link:</label>
                    <input
                      type="text"
                      id="facebookLink"
                      name="facebookLink"
                      value={editFormData.facebookLink}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="bio">Bio:</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={editFormData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="location">Location:</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={editFormData.location}
                      onChange={handleInputChange}
                      placeholder="Enter your location"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="interests">Interests:</label>
                    <input
                      type="text"
                      id="interests"
                      name="interests"
                      value={editFormData.interests}
                      onChange={handleInputChange}
                      placeholder="Your interests (e.g., hiking, photography)"
                      className="form-input"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="update-profile-button">
                      Update Profile
                    </button>
                    <button type="button" className="cancel-edit-button" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </div>
                </form>
                {successMessage && (
                  <div className="success-message">{successMessage}</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


export default UserProfile;
