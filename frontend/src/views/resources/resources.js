import React from 'react'
import {useState, useEffect} from 'react';
import "./resources.css"


export default function Resources() {
    const [resources, setResources] = useState([])
const getResources = async () => {
    const response = await fetch(
        "http://localhost:3000/resources"
    );
    const data = await response.json();
    console.log(data);
    setResources(data);
};

useEffect(() => {
   getResources()
}, [])
    return (
        <div className="resources_container">
            <ul>
                {resources.map((res)=> {
                    return <div className="resource_item">
                        <h1>{res.name}</h1>
                        <h1>{res.description}</h1>
                    </div>    
                })}
            </ul>
        </div>
    )
}
