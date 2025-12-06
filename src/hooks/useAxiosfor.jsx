import axios from 'axios';
// import React from 'react';

const axiosfor=axios.create({
    baseURL: 'http://localhost:5000'
})

const useAxiosfor = () => {
    return axiosfor;
};

export default useAxiosfor;