//PopularItems new
// import { useState, useEffect } from 'react';
import ShowPopularItems from '../Shared/ShowPopularItems/ShowPopularItems';
import SectionTitle from '../Home/Components1/SectionTitle/SectionTitle';
import useAllCategoryData from '../../hooks/useAllCategoryData';

function ProductList() {
  const [Items] = useAllCategoryData();
  let newItems = [];
  if (Items.length > 3) {
    newItems = Items.slice(0, 3);
    // console.log(newItems.length, newItems);
  }
  else {
    newItems = Items;
  }
  return (
    <div className='sm:mt-20'>
      <SectionTitle
        upTitle={"--From our site--"}
        belowTitle={"SOME POPULAR ITEMS"}
      ></SectionTitle>
      <div className="grid md:grid-cols-3 m-4 gap-4 sm:grid-cols-1">
        {/* <h1>Popular Products</h1> className="grid md:grid-cols-2 gap-4" */}
        {newItems.map((item) => (
          <div key={item.id}>
            {item.products?.map((product) => (
              product.popular==true && (
                <div key={product.id} className='mb-3 w-auto'>
                  <ShowPopularItems
                    product={product}
                ></ShowPopularItems>
                </div>
              )
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
