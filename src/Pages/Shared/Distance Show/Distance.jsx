import React from 'react';
import './Distance.css';

const Distance = ({distance}) => {
    console.log(distance);
    return (
        <div>
            <h1 className='text-2xl distance-text'>Distance:<span className='text-green-500'>{distance.toFixed(2)}</span></h1>
        </div>
    );
};

export default Distance;