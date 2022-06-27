import axios from 'axios'
import React from 'react'
import StandardModal from './modals/standard-modal/StandardModal'

export default function ExtraFields(props) {
    const [show, setShow] = React.useState(false);
    let table = props.table
    const url = `http://localhost:3000/getExtrafields?table=${table}`
    const extrafields = []

    axios.get(url).then((res)=>{
        console.log(res)
    })

    const pushExtraField = (field)=>{
        extrafields.push(field)
    }


    return (
        <>
            <StandardModal show={show} hasTransition hasIconAnimation icon='success' onCloseAction={()=>{setShow(false)}} 
            form={<ul> {
                    extrafields.map((field, index) => {
                        return (
                            <li key={index}>
                                <label>{
                                    field.label
                                }</label>
                                <input type="text"
                                    name={
                                        field.name
                                    }
                                    value={
                                        field.value
                                    }
                                    />
                            </li>
                        )
                    })
                    } 
                    <input type="text" placeholder='Extrafield name' />
                    <button onClick={()=>{
                        let name = document.querySelector('input[placeholder="Extrafield name"]').value
                        
                    }}>+</button>
                    </ul>
                }
                />
            <button onClick={()=>{setShow(true)}} className="extrafields_open_modal">
                <i>+</i>
            </button>
        </>
    )
}
