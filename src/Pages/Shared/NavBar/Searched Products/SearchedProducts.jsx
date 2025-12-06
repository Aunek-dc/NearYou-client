// import React from 'react';

import { useEffect, useState } from "react";
import useAllCategoryData from "../../../../hooks/useAllCategoryData";
import { useParams } from "react-router-dom";
import ShowPopularItems from "../../ShowPopularItems/ShowPopularItems";
import Cover from "../../Cover/Cover";
import img from "../../../../assets/All Banners/Select Products.jpg";
import Distance from "../../Distance Show/Distance";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // console.log(lat1, lon1, lat2, lon2);
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    // console.log(dLat, dLon);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    // console.log(distance);
    return distance;
};
//main finesellers
// const findNearestSellers = (sellers, product, searchLocation) => {
//     // console.log(sellers);
//     const nearestSellers = [];
//     const distances = [];
//     // console.log(searchLocation);
//     // let s=1;

//     // sellers.forEach(seller => {
//     //     // s++;
//     //     // console.log(seller);
//     //     seller.products?.filter(prod => {
//     //         // console.log(prod);
//     //         if (prod.product_name === product) {
//     //             // console.log(prod.product_name, seller.owner_name);
//     //             const distance = calculateDistance(searchLocation.latitude, searchLocation.longitude, seller.latitude, seller.longitude);
//     //             // console.log(distance,seller);
//     //             distances.push({ seller, distance });
//     //         }
//     //     });
//     // });

//     // Sort distances in ascending order
//     // console.log(distances)

//     sellers.forEach(seller => {
//         // s++;
//         // console.log(seller);
//         seller.products?.filter(prod => {
//             const normalizedProductName = prod.product_name.toLowerCase().trim();
//             // console.log(normalizedProductName);
//             const normalizedSearchTerm = product.toLowerCase().trim();
//             // console.log(normalizedSearchTerm);

//             // console.log(prod);
//             if (normalizedProductName.includes(normalizedSearchTerm)) {
//                 // console.log(prod.product_name, seller.owner_name);
//                 const distance = calculateDistance(searchLocation.latitude, searchLocation.longitude, seller.latitude, seller.longitude);
//                 // console.log(distance, seller);
//                 distances.push({ seller, distance });
//             }
//         });
//     });


//     distances.sort((a, b) => a.distance - b.distance);
//     // console.log(distances);

//     // Take the 20 nearest sellers
//     for (let i = 0; i < Math.min(distances.length, 20); i++) {
//         nearestSellers.push(distances[i].seller);
//         // console.log(distances[i].seller, product);
//     }

//     return nearestSellers;
// };
const findNearestSellers = (sellers, product, searchLocation) => {
    // console.log(sellers,product,searchLocation);
    if (!sellers || !Array.isArray(sellers)) return []; // Ensure sellers is defined and is an array

    const nearestSellers = [];
    const distances = [];

    sellers.forEach(seller => {
        if (!seller.products || !Array.isArray(seller.products)) return;

        // Filter out duplicate products for the same seller
        const uniqueProducts = seller.products?.filter((prod, index, self) => 
            index === self.findIndex(p => p.product_name.toLowerCase().trim() === prod.product_name.toLowerCase().trim())
        );

        uniqueProducts.forEach(prod => {
            const normalizedProductName = prod.product_name.toLowerCase().trim();
            // console.log(normalizedProductName);
            const normalizedSearchTerm = product.toLowerCase().trim();

            if (normalizedProductName.includes(normalizedSearchTerm)) {
                const distance = calculateDistance(searchLocation.latitude, searchLocation.longitude, seller.latitude, seller.longitude);
                distances.push({ seller, product: prod, distance });
            }
        });
    });

    distances.sort((a, b) => a.distance - b.distance);

    for (let i = 0; i < Math.min(distances.length, 20); i++) {
        nearestSellers.push(distances[i]);
    }

    return nearestSellers;
};

// const SearchedProducts = () => {
//     const { location, searchValue } = useParams();
//     const decodedLocation = JSON.parse(decodeURIComponent(location));
//     // console.log(decodedLocation);

//     // Now you have access to the decoded object and searched value
//     // console.log(location ,decodedLocation);
//     // console.log("Up all: ", searchValue);

//     // // const { location, searchValue } = useParams();

//     // const location = useLocation();
//     // const { pathname } = location;

//     // // Extract the encoded object and searched value from the URL
//     // const [, encodedLocation, searchValue] = pathname.split('/').slice(2);

//     // // Decode and parse the object back to its original form
//     // const extractedlocation = JSON.parse(decodeURIComponent(encodedLocation));

//     // // const parsedlocation = JSON.parse(decodeURIComponent(location));
//     // console.log("Location-" + extractedlocation, searchValue);


//     const sellerData = useAllCategoryData();

//     // console.log(sellerData);
//     // console.log(sellerData, parsedlocation, searchValue);
//     // const [nearestSellers, setNearestSellers] = useState([]);
//     const [searchLocation, setSearchLocation] = useState(decodedLocation);
//     const [productToSearch, setProductToSearch] = useState(searchValue);
//     const [nearestSellers, setNearestSellers] = useState([]);

//     console.log(nearestSellers);

//     useEffect(() => {
//         // console.log(searchLocation);
//         // if (sellerData[0].length > 0) {
//         // console.log(sellerData, productToSearch,searchLocation);
//         const nearest = findNearestSellers(sellerData[0], productToSearch, searchLocation);
//         console.log(nearest);
//         setNearestSellers(nearest);
//         // }
//     }, [sellerData[0], productToSearch, searchLocation, nearestSellers]);
//     // console.log(nearestSellers);

//     // const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     //     const R = 6371; // Earth's radius in kilometers
//     //     const dLat = (lat2 - lat1) * Math.PI / 180;
//     //     const dLon = (lon2 - lon1) * Math.PI / 180;
//     //     const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     //               Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//     //               Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     //     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     //     const distance = R * c;
//     //     return distance;
//     // };

//     // const findNearestSellers = (sellers, product, searcherLocation) => {
//     //     if (!sellers.length || !product) return []; // Early return if no sellers or no product to search

//     //     const distances = [];

//     //     sellers.forEach(seller => {
//     //         const filteredProducts = seller.products.filter(prod => prod.product_name === product);
//     //         if (filteredProducts.length > 0) {
//     //             const distance = calculateDistance(searcherLocation.lat, searcherLocation.lon, seller.latitude, seller.longitude);
//     //             distances.push({ seller, distance });
//     //         }
//     //     });

//     //     distances.sort((a, b) => a.distance - b.distance);

//     //     return distances.slice(0, 20).map(item => item.seller);
//     // };

//     // useEffect(() => {
//     //     const nearest = findNearestSellers(sellerData[0], productToSearch, searchLocation);
//     //     setNearestSellers(nearest);
//     // }, [sellerData, productToSearch, searchLocation]);


//     // const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     //     console.log(lat1,lon1,lat2,lon2);
//     //     const R = 6371;
//     //     const dLat = (lat2 - lat1) * Math.PI / 180;
//     //     const dLon = (lon2 - lon1) * Math.PI / 180;
//     //     const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     //         Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//     //         Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     //     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     //     const distance = R * c;
//     //     return distance;
//     // };


//     // const findNearestSellers = (sellers, product, searcherLocation) => {
//     //     // console.log("Find Nearest Sellers: ", sellers, product, searcherLocation);
//     //     const nearestSellers = [];
//     //     const distances = [];
//     //     // console.log(sellers);
//     //     sellers?.forEach(seller => {
//     //         seller?.products?.forEach(prod => {
//     //             // console.log(prod,productToSearch,location);
//     //             // console.log(prod,searchValue,location);                
//     //             if (prod.product_name === product) {
//     //                 // const distance = calculateDistance(searchLocation.lat, searchLocation.lon, seller.latitude, seller.longitude);
//     //                 const distance = calculateDistance(searcherLocation.lat, searcherLocation.lon, seller.latitude, seller.longitude);
//     //                 distances.push({ seller, distance });
//     //             }
//     //         });
//     //     });

//     //     distances.sort((a, b) => a.distance - b.distance);

//     //     for (let i = 0; i < Math.min(distances.length, 20); i++) {
//     //         nearestSellers.push(distances[i].seller);
//     //     }

//     //     return nearestSellers;
//     // };

//     // useEffect(() => {
//     //     const sellers = sellerData;
//     //     // console.log(sellers);
//     //     const nearest = findNearestSellers(sellers[0], productToSearch, searchLocation);
//     //     // const nearest = findNearestSellers(sellers, searchValue, decodedLocation);
//     //     setNearestSellers(nearest);
//     // }, []);

//     return (
//         <div>
//             {/* <h1>20 Nearest Sellers:</h1> */}
//             <section className="h-full">
//                 <Cover img={img} title={"YOUR DESIRED PRODUCTS BELOW!"}></Cover>
//             </section>

//             {/* <ul>
//                 {nearestSellers.map((seller, index) => (
//                     <li key={index}>
//                         {seller.owner_name} - Distance: {calculateDistance(location.lat, location.lon, seller.latitude, seller.longitude).toFixed(2)} km
//                     </li>
//                 ))}
//             </ul> */}
//             {/* <div className="grid md:grid-cols-2 gap-4 sm:grid-cols-1">
//                 <h1>Popular Products</h1> className="grid md:grid-cols-2 gap-4"
//                 {nearestSellers.map((seller) => (
//                     <div key={seller.id}>
//                         {seller.products.map((product) => (
//                             Render the product only if it's popular
//                             (
//                                 <div key={product.id}>
//                                     {console.log(product)}
//                                     {productToSearch===product.product_name && <ShowPopularItems
//                                         key={product.id}
//                                         product={product}
//                                     ></ShowPopularItems>}
//                                 </div>
//                             )
//                         ))}
//                     </div>
//                 ))}
//             </div> */}

//             <div className="grid md:grid-cols-2 gap-4 sm:grid-cols-1">
//                 {/* <h1>Popular Products</h1> className="grid md:grid-cols-2 gap-4" */}
//                 {nearestSellers.map((seller) => (
//                     <div key={seller.id}>
//                         {seller.products.map((product) => {
//                             const normalizedProductName = product.product_name.toLowerCase().trim();
//                             const normalizedSearchTerm = productToSearch.toLowerCase().trim();

//                             return (
//                                 <div key={product.id}>
//                                     {/* {console.log(product)} */}
//                                     {normalizedProductName.includes(normalizedSearchTerm) && (
//                                         <ShowPopularItems
//                                             key={product.id}
//                                             product={product}
//                                         ></ShowPopularItems>
//                                     )}
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 ))}
//             </div>

//         </div>
//     );
// };
const SearchedProducts = () => {
    const { location, searchValue } = useParams();
    const decodedLocation = JSON.parse(decodeURIComponent(location));
    const sellerData = useAllCategoryData();
    const [searchLocation, setSearchLocation] = useState(decodedLocation);
    const [productToSearch, setProductToSearch] = useState(searchValue);
    const [nearestSellers, setNearestSellers] = useState([]);
    // console.log(nearestSellers);
    // console.log(nearestSellers);

    useEffect(() => {
        const fetchNearestSellers = async () => {
            if (sellerData && sellerData.length > 0 && sellerData[0].length > 0) { // Check if sellerData is defined and has length
                const nearest = findNearestSellers(sellerData[0], productToSearch, searchLocation);
                // console.log(nearest)
                setNearestSellers(nearest);
            }
        };

        fetchNearestSellers();
    }, [sellerData[0], productToSearch, searchLocation]);

    return (
        <div>
            <section className="h-full">
                <Cover img={img} title={"YOUR Nearest product BELOW!"}></Cover>
            </section>
            <div className="grid md:grid-cols-2 gap-4 sm:grid-cols-1">
                {nearestSellers.map(({ seller, product,distance }) => (
                    <div key={`${seller.id}-${product.id}`}>
                        <Distance 
                        key={product.id}
                        distance={distance}
                        >
                        </Distance>
                        <ShowPopularItems
                            key={product.id}
                            product={product}
                        ></ShowPopularItems>
                    </div>
                ))}
            </div>
        </div>
    );
};


// v1//

// const findNearestSellers = (seller, product, searcherLocation) => {
//     if (!sellers.length || !product) return [];
//     // console.log(sellers, product, searcherLocation);

//     const distances = [];

//     sellers.forEach(seller => {
//         const filteredProducts = sellers.flatMap(seller => {
//             // console.log(sellers ,seller, product);
//             // console.log(sellers[0] ,seller, product);
//             // console.log(seller, product);
//             // console.log(seller.products, product);
//             // console.log(seller.products[1], product);
//             seller.products.filter(prod => prod.product_name === product);
//         });
//         // console.log(filteredProducts);
//         if (filteredProducts.length > 0) {
//             const distance = calculateDistance(searcherLocation.lat, searcherLocation.lon, seller.latitude, seller.longitude);
//             distances.push({ seller, distance });
//         }
//     });
//     distances.sort((a, b) => a.distance - b.distance);
//     return distances.slice(0, 20).map(item => item.seller);
// };

// const findNearestSellers = (sellers, product, searchLocation) => {
//     const nearestSellers = [];
//     const distances = [];
//     const seenProducts = new Set(); // To track product-seller pairs

//     sellers.forEach(seller => {
//         seller.products?.forEach(prod => {
//             const normalizedProductName = prod.product_name?.toLowerCase().trim();
//             const normalizedSearchTerm = product.toLowerCase().trim();
//             const productSellerKey = `${normalizedProductName}-${seller.id}`; // Unique key for product-seller pair

//             if (normalizedProductName.includes(normalizedSearchTerm) && !seenProducts.has(productSellerKey)) {
//                 const distance = calculateDistance(searchLocation.latitude, searchLocation.longitude, seller.latitude, seller.longitude);
//                 distances.push({ seller, product: prod, distance });
//                 seenProducts.add(productSellerKey);
//             }
//         });
//     });

//     distances.sort((a, b) => a.distance - b.distance);

//     for (let i = 0; i < Math.min(distances.length, 20); i++) {
//         nearestSellers.push(distances[i]);
//     }

//     return nearestSellers;
// };

// const SearchedProducts = () => {
//     const { location, searchValue } = useParams();
//     const decodedLocation = JSON.parse(decodeURIComponent(location));
//     const sellerData = useAllCategoryData();
//     const [searchLocation, setSearchLocation] = useState(decodedLocation);
//     const [productToSearch, setProductToSearch] = useState(searchValue);
//     const [nearestSellers, setNearestSellers] = useState([]);

//     useEffect(() => {
//         if (sellerData && sellerData.length > 0) { // Check if sellerData is defined and has length
//             const nearest = findNearestSellers(sellerData[0], productToSearch, searchLocation);
//             setNearestSellers(nearest);
//         }
//     }, [sellerData[0], productToSearch, searchLocation]);

//     return (
//         <div>
//             <section className="h-full">
//                 <Cover img={img} title={"YOUR DESIRED PRODUCTS BELOW!"}></Cover>
//             </section>
//             <div className="grid md:grid-cols-2 gap-4 sm:grid-cols-1">
//                 {nearestSellers.map(({ seller, product }) => (
//                     <div key={`${seller.id}-${product.id}`}>
//                         <ShowPopularItems
//                             key={product.id}
//                             product={product}
//                         ></ShowPopularItems>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

//Main searched Products



export default SearchedProducts;