// import PopularItems from "../../PopularItems/PopularItems";
import { Helmet } from "react-helmet-async";
import ProductList from "../../PopularItems/ProductList";
import Banner from "../Banner/Banner";
import Category from "../Category/Category";
import Reviews from "../Reviews/Reviews";
import "./Home.css";
import LoadingSpinner from "../../../Shared Components/Spinner/LoadingSpinner";
import { useEffect, useState } from "react";
import StartBusinessGuide from "../../StartBusinessGuide/StartBusinessGuide";
// const Home = () => {
//     return (
//         <div>
//             <Helmet>
//                 <title>Home</title>
//             </Helmet>
//             <Banner></Banner>
//             <Category></Category>
//             <ProductList></ProductList>
//             {/* <PopularItems></PopularItems> */}
//             <Reviews></Reviews>
//         </div>
//     );
// };

// const Home = () => {
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         // Simulate loading delay
//         const timer = setTimeout(() => {
//             setLoading(false);
//         }, 2000); // Adjust the delay as needed

//         return () => clearTimeout(timer);
//     }, []);

//     return (
//         <div>
//             <Helmet>
//                 <title>Home</title>
//             </Helmet>
//             {loading ? (
//                 <div className="loading"><LoadingSpinner></LoadingSpinner></div>
//             ) : (
//                 <>
//                     <div className="banner-background">
//                         <Banner />
//                     </div>
//                     <div className="category-background">
//                         <Category />
//                     </div>
//                     <div className="product-list-background">
//                         <ProductList />
//                     </div>
//                     <div>
//                         <StartBusinessGuide/>
//                     </div>
//                     <div className="reviews-background">
//                         <Reviews />
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };

const Home = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading delay
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000); // Adjust the delay as needed

        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            <Helmet>
                <title>Home</title>
            </Helmet>
            {loading ? (
                <div className="loading"><LoadingSpinner /></div>
            ) : (
                <>
                    <div className="">
                        <Banner />
                    </div>
                    <div className="category-background">
                        <Category />
                    </div>
                    <div className="product-list-background">
                        <ProductList />
                    </div>
                    <div>
                        <StartBusinessGuide />
                    </div>
                    <div className="reviews-background">
                        <Reviews />
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;