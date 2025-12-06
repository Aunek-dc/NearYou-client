

// import React from 'react';
import "./LoadingSpinner.css";
// const LoadingSpinner = () => {
//   return (
//     <div className="load flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
//       {/* <span className="text-gray-600 text-lg ml-2">Loading...</span> */}
//     </div>
//   );
// };
const LoadingSpinner = ({ showText = false }) => {
  return (
    <div 
      className="load flex justify-center items-center min-h-screen bg-gray-100" 
      aria-busy="true" 
      aria-live="polite"
    >
      <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
      {showText && <span className="text-gray-600 text-lg ml-2">Loading...</span>}
    </div>
  );
};

export default LoadingSpinner;
