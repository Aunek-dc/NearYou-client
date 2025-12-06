// import React from 'react';

import Cover from "../Shared/Cover/Cover";
import img from "../../assets/All Banners/istockphoto-1412148116-2048x2048.jpg";
import useSomeCategory from "../../hooks/useSomeCategory";
import ShowPopularItems from "../Shared/ShowPopularItems/ShowPopularItems";
// import img1 from "../../assets/All Banners/istockphoto-1328836875-2048x2048.jpg";
import { Helmet } from "react-helmet-async";
import useAllCategoryData from "../../hooks/useAllCategoryData";
import styles from './CategoryTypes.module.css';

const CategoryTypes = () => {
    const allCatData = useAllCategoryData();

    let categories = {};

    // Assuming categoryProducts is an array of arrays of product objects
    const categoryProducts = allCatData[0].map(data => data.products?.map(product => product));

    categoryProducts.forEach(productArray => {
        productArray.forEach(product => {
            const category = product.category;
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(product);
        });
    });

    // console.log(categories);

    // const categoryData = useSomeCategory("Electronics");
    return (
        <div className="">
            <section>
                <Helmet>
                    <title>Category</title>
                </Helmet>
                <Cover
                    img={img}
                    title={"Select Category"}
                ></Cover>
            </section>
            <section>
                {/* <Cover
                    img={img1}
                    title={'Electronics'}
                ></Cover> */}
                <div className="grid md:grid-cols-3 gap-4 mb-5">
                    {
                        Object.entries(categories).map(([category, products]) => (
                            <div key={category}>
                                <h2 className={styles.categoryTitle}>{category}</h2>
                                {products.map(product => (
                                    <ShowPopularItems
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </div>
                        ))
                    }
                </div>
            </section>
        </div>
    );
};

export default CategoryTypes;