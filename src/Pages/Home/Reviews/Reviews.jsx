// import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import './styles.css';

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import SectionTitle from "../Components1/SectionTitle/SectionTitle";
import { useEffect, useState } from 'react';

import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'

const Reviews = () => {
    const [revs, setRevs] = useState([]);
    useEffect(() => {
        fetch("http://localhost:5000/reviews")
            .then(res => res.json())
            .then(data => {
                setRevs(data)
            })
    }, [])
    return (
        <div>
            <SectionTitle
                upTitle={"--About--"}
                belowTitle={"WHAT PEOPLE SAY?"}
            ></SectionTitle>
            <div className='p-4 mt-0'>
            <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {
                        revs.map(rev => <SwiperSlide
                            key={rev.id}
                        >
                            <div className='flex flex-col items-center p-8'>
                                <h2 className="text-yellow-400 text-2xl">{rev.name}</h2>
                                <p className='md:w-96 text-white p-10 md:p-0'>{rev.comment}</p>
                                <p>
                                    <Rating
                                        style={{ maxWidth: 180 }}
                                        value={rev.rating}
                                        readOnly
                                    />
                                </p>
                            </div>
                        </SwiperSlide>)
                    }
      </Swiper>
            </div>
        </div>
    );
};

export default Reviews;