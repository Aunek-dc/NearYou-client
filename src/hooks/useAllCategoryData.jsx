import { useState, useEffect } from "react";

const useAllCategoryData=()=>{
    const [products, setProducts] = useState([]);
    const [loading, setLoading]= useState(true);
    useEffect(() => {
        fetch('http://localhost:5000/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
    }, [])
    return [products,loading];

}

export default useAllCategoryData;