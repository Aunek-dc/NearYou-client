// import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

import img1 from '../../../assets/Carousel/Carousel-1.jpg';
import img2 from '../../../assets/Carousel/Carousel-2.jpg';
import img3 from '../../../assets/Carousel/Carousel-3.jpg';
import img4 from '../../../assets/Carousel/Carousel-4.jpg';
// import img5 from '../../../assets/Carousel/Carousel-5.jpg';
import img6 from '../../../assets/Carousel/Carousel-6.jpg';

const Banner = () => {

    return (
        <div>
            <Carousel>
        <div className="h-96">
            <img src={img1} />
            <p className="legend"> <span className="text-5xl text-yellow-400 text-center">Electronics </span></p>
        </div>
        <div className="h-96">
            <img src={img2} />
            <p className="legend"> <span className="text-5xl text-yellow-400 text-center">Books & Stationery </span></p>
        </div>
        <div className="h-96">
            <img src={img3} />
            <p className="legend"> <span className="text-5xl text-yellow-400 text-center">Toys & Games </span></p>
        </div>
        <div className="h-96">
            <img src={img4} />
            <p className="legend"> <span className="text-5xl text-yellow-400 text-center">Sports & Outdoors </span></p>
        </div>
        {/* <div className="h-96">
            <img src={img5} />
            <p className="legend"> <span className="text-5xl text-yellow-400 text-center">Health & Wellness </span></p>
        </div> */}
        <div className="h-96">
            <img src={img6} />
            <p className="legend"> <span className="text-5xl text-yellow-400 text-center">Clothing & Apparel </span></p>
        </div>
    </Carousel>
        </div>
    );
};

export default Banner;