import axios from 'axios'
import React from 'react'
import {useEffect} from 'react'

let resources = []
const getAllResources = async()=>{
    resources = await axios.get("http://localhost:3000/resources").data
}

export default function Resources() {
    
    useEffect(() => {
        return () => {
            getAllResources()
        }
    }, [])
    console.log(resources)
    return (
        <div>
            <ul>
            {resources.map((data)=>{
                return <li>
                    <h1>{data.name}</h1>
                    <h1>{data.description}</h1>
                </li>
            })}
            </ul>
        </div>
    )
}
