// import React from 'react';
import { useQuery } from "@tanstack/react-query";
import useAxiosfor from "./useAxiosfor";
import useAuth from "./useAuth";

const useCart = () => {
    const axiosFor = useAxiosfor();
    // console.log(axiosFor); // Debug: Ensure axiosFor is properly initialized
    const { user } = useAuth();
    
    const { refetch, data: carts = [] } = useQuery({
        queryKey: ['carts', user?.email], // Query key includes user email
        queryFn: async () => {
            if (!user?.email) {
                return []; // Return empty array if user email is not available
            }
            const res = await axiosFor.get(`/cart?email=${user?.email}`);
            // console.log(res); // Debug: Check the response from the server
            return res.data;
        },
        enabled: !!user?.email, // Query only runs if user email is available
    });

    return [carts, refetch];
};

export default useCart;
