// import React from 'react';

import Cover from "../../Shared/Cover/Cover";
// import img from "../../../assets/All Banners/istockphoto-1475229983-2048x2048.jpg"
import { Helmet } from 'react-helmet-async';

const AllProducts = () => {
    return (
        <div>
            <Helmet>
                <title>Products</title>
            </Helmet>
            <div className="mb-10">
                {/* <Cover className="h-28" img={img} title={'Select products below'}></Cover> */}
            </div>
        </div>
    );
};

export default AllProducts;