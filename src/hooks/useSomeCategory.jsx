// import React from 'react';
import useAllCategoryData from "./useAllCategoryData";

const useSomeCategory = (cateChoosen) => {
    const allData=useAllCategoryData();
    const categoryData=[];
    allData[0].filter(product => {
        product?.products?.map(innerproduct => {
            if (innerproduct.category === cateChoosen) {
                categoryData.push(innerproduct);
            }
        });
    }
    );
    return [categoryData];
};

export default useSomeCategory;