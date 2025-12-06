// import React from 'react';

const SectionTitle = ({upTitle, belowTitle}) => {
    return (
        <div className="text-center mx-auto md:w-6/12">
            <h3 className="text-yellow-400 text-xl mb-3">{upTitle}</h3>
            <p className="text-4xl uppercase border-y-2 mb-2 py-2">{belowTitle}</p>
        </div>
    );
};

export default SectionTitle;