import React from 'react'
import './componentStyles/loadUsersCSV.css'
import BatcherButtonTemplate from './BatcherButtonTemplate'

export default function Batcher(props) {
    return (
        <BatcherButtonTemplate type={props.type}/>
    )
}
