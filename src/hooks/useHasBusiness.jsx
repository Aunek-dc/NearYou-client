// import React from 'react';

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context Providers/AuthProvider";

const useHasBusiness = () => {
    const { user } = useContext(AuthContext);
    const [hasBusiness, setHasBusiness] = useState(false);
    useEffect(() => {
        if (user) {
            // Fetch user profile data to check if they have a business profile
            fetch(`/api/user/${user.uid}`)
                .then(response => response.json())
                .then(data => setHasBusiness(data.hasBusiness))
                .catch(error => console.error('Error fetching user data:', error));
        }
    }, [user]);
    return [hasBusiness];
};

export default useHasBusiness;