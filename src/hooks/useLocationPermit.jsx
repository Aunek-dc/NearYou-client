import { useState, useEffect } from 'react';

const useLocationPermit = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.permissions) {
        navigator.permissions.query({ name: 'geolocation' }).then((permission_Status) => {
          if (permission_Status.state === 'granted' || permission_Status.state === 'prompt') {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                  });
                },
                (error) => {
                  setError(error.message);
                }
              );
            } else {
              setError('Geolocation is not supported');
            }
          } else {
            setError('Location permission is denied.');
          }
        });
      } else {
        setError('Geolocation permission API is not supported');
      }
    };

    getLocation();
  }, []);

  return { location, error };
};

export default useLocationPermit;
