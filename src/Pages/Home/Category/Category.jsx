// import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';

import img1 from "../../../assets/Carousel/Carousel-1.jpg"
import img2 from "../../../assets/Carousel/Carousel-2.jpg"
import img3 from "../../../assets/Carousel/Carousel-3.jpg"
import img4 from "../../../assets/Carousel/Carousel-4.jpg"
import img5 from "../../../assets/Carousel/Carousel-6.jpg"
import SectionTitle from '../Components1/SectionTitle/SectionTitle';
import { useState } from 'react';
import useAllCategoryData from '../../../hooks/useAllCategoryData';
import ShowPopularItems from '../../Shared/ShowPopularItems/ShowPopularItems';



const Category = () => {
    const [categorySelection, setCategorySelection] = useState(null);
    const handleCategory = (cate) => {
        setCategorySelection(cate);
    }
    return (
        <section>
            <SectionTitle
                upTitle={"--From 10am to 10pm--"}
                belowTitle={"MANY CATEGORIES"}
            ></SectionTitle>
            <Swiper
                slidesPerView={4}
                spaceBetween={30}
                centeredSlides={true}
                pagination={{
                    clickable: true,
                }}
                modules={[Pagination]}
                className="mySwiper mb-6"
            >
            <SwiperSlide onClick={() => handleCategory('Electronics')}>
                    <img src={img1} alt="" />
                    <h3 className='text-center md:text-3xl md:-mt-16 text-yellow-200'>Electronics</h3>
                </SwiperSlide>
                <SwiperSlide onClick={() => handleCategory('Books')}>
                    <img src={img2} alt="" />
                    <h3 className='text-center md:text-3xl md:-mt-16 text-yellow-200'>Books</h3>
                </SwiperSlide>
                <SwiperSlide onClick={() => handleCategory('Toys')}>
                    <img src={img3} alt="" />
                    <h3 className='text-center md:text-3xl md:-mt-16 text-yellow-200'>Toys</h3>
                </SwiperSlide>
                <SwiperSlide onClick={() => handleCategory('Sports')}>
                    <img src={img4} alt="" />
                    <h3 className='text-center md:text-3xl md:-mt-16 text-yellow-200'>Sports</h3>
                </SwiperSlide>
                <SwiperSlide onClick={() => handleCategory('Clothes')}>
                    <img src={img5} alt="" />
                    <h3 className='text-center md:text-3xl md:-mt-16 text-yellow-200'>Clothes</h3>
                </SwiperSlide>
            </Swiper>
            {categorySelection && (
                <SelectedCategoryPage
                    category={categorySelection}
                />
            )}
        </section>
    );
};

const SelectedCategoryPage = ({ category }) => {
    const [allproducts] = useAllCategoryData();
    const newProduct = [];
    allproducts.filter(product => {
        product?.products?.map(innerproduct => {
            if (innerproduct.category === category) {
                newProduct.push(innerproduct);
            }
        });
    }
    );
    const displayedProducts = newProduct.slice(0, 3);
    console.log(displayedProducts.length);
    return (
        <div>
            <div className="md:flex md:flex-row gap-8 ml-8">
                {/* <h1>Popular Products</h1> className="grid md:grid-cols-2 gap-4" */}
                {
                    displayedProducts.length >= 1 && displayedProducts.map(seller => (
                        // <div key={seller.id}>
                        //     {seller.products?.map((product) => (
                        //         <div key={product.id}>
                        //             <ShowPopularItems
                        //                 product={product}
                        //             ></ShowPopularItems>
                        //         </div>
                        //         //   )
                        //     ))}
                        // </div>
                        <div key={seller.id}>
                            <ShowPopularItems
                                product={seller}
                            ></ShowPopularItems>
                        </div>

                    ))
                }
            </div>
        </div>
    );
};



export default Category;