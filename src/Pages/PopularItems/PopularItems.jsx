// import React from 'react';

import { useEffect, useState } from "react";
// import SectionTitle from "../Home/Components1/SectionTitle/SectionTitle";
import ShowPopularItems from "../Shared/ShowPopularItems/ShowPopularItems";

const PopularItems = () => {
    const [things, setthings] = useState([]);
    useEffect(() => {
        fetch('Popularthings.json')
            .then(res => res.json())
            .then(data => {
                const toSetPopularItems = data.filter(item => item.popular === true);
                setthings(toSetPopularItems);
            })
    }, [])
    return (
        <div>
            <div className="grid md:grid-cols-2 gap-4">
            {
                things.map(thing=>
                thing.id<=10 &&
                <ShowPopularItems
                key={thing.id}
                thing={thing}
                ></ShowPopularItems>
            )
            }
            </div>
        </div>
    );
};

export default PopularItems;