import { useState, useEffect } from 'react';
import useAxiosfor from '../../../hooks/useAxiosfor';
import useAuth from '../../../hooks/useAuth';
import { Helmet } from 'react-helmet-async';
import LoadingSpinner from "../../../Shared Components/Spinner/LoadingSpinner";

const BusinessProfileForm = () => {
  const axiosFor = useAxiosfor();
  const { user } = useAuth();

  const [businessDetails, setBusinessDetails] = useState({
    userId: '',
    businessName: '',
    ownerName: '',
    ownerProfilePicture: '',
    businessLogo: '',
    businessEmail: '',
    businessPhone: '',
    businessAddress: '',
    businessDescription: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        setIsLoading(true);
        try {
          const response = await axiosFor.get('/users');
          const userData = response.data;

          const currentUser = userData.find(u => u.userId === user.uid);

          if (currentUser) {
            const { userId, haveBusiness } = currentUser;
            setBusinessDetails(prevDetails => ({ ...prevDetails, userId }));

            if (haveBusiness) {
              const profileResponse = await axiosFor.get(`/products?userId=${userId}`);
              const profile = profileResponse.data.find(p => p.userId === userId);
              if (profile) {
                setBusinessDetails({
                  userId,
                  businessName: profile.businessName,
                  ownerName: profile.ownerName,
                  ownerProfilePicture: profile.ownerProfilePicture,
                  businessLogo: profile.businessLogo,
                  businessEmail: profile.businessEmail,
                  businessPhone: profile.businessPhone,
                  businessAddress: profile.businessAddress,
                  businessDescription: profile.businessDescription,
                });
                setProfileId(profile._id);
                setIsSubmitted(true);
              } else {
                setIsSubmitted(false);
              }
            } else {
              setIsSubmitted(false);
            }
          } else {
            console.error('User not found.');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
        setIsLoading(false);
      };

      fetchUserData();
    }
  }, [axiosFor, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusinessDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          submitBusinessProfile(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error obtaining location:', error);
          submitBusinessProfile(null, null);
        }
      );
    } else {
      submitBusinessProfile(null, null);
    }
  };

  const submitBusinessProfile = async (latitude, longitude) => {
    try {
      const payload = {
        ...businessDetails,
        latitude,
        longitude,
        isBusinessProfileDone: true,
      };

      console.log('Submitting payload:', payload);

      let response;

      if (profileId) {
        response = await axiosFor.put(`/products/${profileId}`, payload);
      } else {
        console.log('Creating new business profile');
        response = await axiosFor.post('/products', payload);
        setProfileId(response.data.insertedId);
      }

      if (response.status === 200 || response.status === 201) {
        setIsSubmitted(true);
        const updatedBusinessDetails = response.data;
        setBusinessDetails(prevDetails => ({
          ...prevDetails,
          ...updatedBusinessDetails
        }));
        await axiosFor.put(`/users/${updatedBusinessDetails.userId}`, { haveBusiness: true });
        console.log('Business profile submitted successfully.');
      } else {
        console.error('Failed to submit business profile:', response.data);
      }
    } catch (error) {
      console.error('Error creating/updating business profile:', error.response?.data || error.message);
    }
  };

  const handleToggleLocation = () => {
    setShowLocation(!showLocation);
  };

  const handleEdit = () => {
    setIsSubmitted(false);
  };

  const handleDelete = async () => {
    try {
      if (profileId) {
        await axiosFor.delete(`/products/${profileId}`);
        setBusinessDetails({
          userId: businessDetails.userId,
          businessName: '',
          ownerName: '',
          ownerProfilePicture: '',
          businessLogo: '',
          businessEmail: '',
          businessPhone: '',
          businessAddress: '',
          businessDescription: '',
        });
        setProfileId(null);
        setIsSubmitted(false);
        await axiosFor.put(`/users/${businessDetails.userId}`, { haveBusiness: false });
      }
    } catch (error) {
      console.error('Error deleting business profile:', error.response?.data || error.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <Helmet>
        <title>Business Profile</title>
      </Helmet>
      {isLoading ? (
        <LoadingSpinner />
      ) : isSubmitted ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">Business Profile</h1>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Owner Details</h2>
              {businessDetails.ownerProfilePicture && (
                <img src={businessDetails.ownerProfilePicture} alt="Owner Profile" className="w-full h-48 object-cover rounded-lg mb-4" />
              )}
              <p><strong>Owner Name:</strong> {businessDetails.ownerName}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Business Details</h2>
              {businessDetails.businessLogo && (
                <img src={businessDetails.businessLogo} alt="Business Logo" className="w-full h-48 object-cover rounded-lg mb-4" />
              )}
              <p><strong>Business Name:</strong> {businessDetails.businessName}</p>
              <p><strong>Business Email:</strong> {businessDetails.businessEmail}</p>
              <p><strong>Business Phone:</strong> {businessDetails.businessPhone}</p>
              <p><strong>Business Address:</strong> {businessDetails.businessAddress}</p>
              <p><strong>Business Description:</strong> {businessDetails.businessDescription}</p>
            </div>
          </div>
          <div className="flex space-x-4 mt-4">
            <button onClick={handleEdit} className="text-blue-600 hover:underline">Edit Profile</button>
            <button onClick={handleDelete} className="text-red-600 hover:underline">Delete Profile</button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">{profileId ? 'Update Your Business' : 'Register Your Business'}</h1>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Owner Details</h2>
                <div className="mb-4">
                  <label htmlFor="ownerName" className="block text-gray-700">Owner Name</label>
                  <input
                    type="text"
                    id="ownerName"
                    name="ownerName"
                    value={businessDetails.ownerName}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="ownerProfilePicture" className="block text-gray-700">Owner Profile Picture Link</label>
                  <input
                    type="text"
                    id="ownerProfilePicture"
                    name="ownerProfilePicture"
                    value={businessDetails.ownerProfilePicture}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                {businessDetails.ownerProfilePicture && (
                  <img src={businessDetails.ownerProfilePicture} alt="Owner Profile" className="w-full h-48 object-cover rounded-lg mb-4" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Business Details</h2>
                <div className="mb-4">
                  <label htmlFor="businessName" className="block text-gray-700">Business Name</label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={businessDetails.businessName}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="businessLogo" className="block text-gray-700">Business Logo Link</label>
                  <input
                    type="text"
                    id="businessLogo"
                    name="businessLogo"
                    value={businessDetails.businessLogo}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                {businessDetails.businessLogo && (
                  <img src={businessDetails.businessLogo} alt="Business Logo" className="w-full h-48 object-cover rounded-lg mb-4" />
                )}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="businessEmail" className="block text-gray-700">Business Email</label>
              <input
                type="email"
                id="businessEmail"
                name="businessEmail"
                value={businessDetails.businessEmail}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="businessPhone" className="block text-gray-700">Business Phone</label>
              <input
                type="text"
                id="businessPhone"
                name="businessPhone"
                value={businessDetails.businessPhone}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="businessAddress" className="block text-gray-700">Business Address</label>
              <input
                type="text"
                id="businessAddress"
                name="businessAddress"
                value={businessDetails.businessAddress}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="businessDescription" className="block text-gray-700">Business Description</label>
              <textarea
                id="businessDescription"
                name="businessDescription"
                value={businessDetails.businessDescription}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows="4"
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <label htmlFor="showLocation" className="flex items-center">
                <input
                  type="checkbox"
                  id="showLocation"
                  name="showLocation"
                  checked={showLocation}
                  onChange={handleToggleLocation}
                  className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">Allow access to your location</span>
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {profileId ? 'Update Profile' : 'Register Business'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default BusinessProfileForm;
