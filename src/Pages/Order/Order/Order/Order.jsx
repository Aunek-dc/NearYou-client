// import React from 'react';
import imgC from '../../../../assets/All Banners/Ordercover.jpg'
import Cover from '../../../Shared/Cover/Cover';
const Order = () => {
    return (
        <div>
           {/* <img src={img} alt=""/> */}
           <Cover img={imgC} title={'Your Orders here'}></Cover>
        </div>
    );
};

export default Order;