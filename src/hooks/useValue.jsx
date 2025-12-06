import { useState } from 'react';

const useValue = () => {
    const [value, setValue] = useState('');

    const sendValue = (newValue) => {
        setValue(newValue);
    };

    return { value, sendValue };
};

export default useValue;
