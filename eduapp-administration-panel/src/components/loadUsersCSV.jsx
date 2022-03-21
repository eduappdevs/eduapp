import React, { useState } from 'react'
import CSVReader from 'react-csv-reader'
import './componentStyles/loadUsersCSV.css'
import PreviewUsersTable from './previewUsersTable'
export default function LoadUsersCSV(props) {
    let tempUsers = []
    const [modalActive, setModalActive] = useState(false)

    const previewUsersLoad = (data, fileInfo, originalFile) => {
        data.map((user) => {
            if (user[0] !== '') {
                console.log('currentuser', user)
                tempUsers.push(user)
            }

        })
        setModalActive(true)
    }

    const closeModal = ()=>  {
        setModalActive(false)
        window.location.reload()
    }
    

    return (
        <>
            <div className="csvLoaderButton">
                <CSVReader onFileLoaded={(data, fileInfo, originalFile) => previewUsersLoad(data, fileInfo, originalFile)} />
            </div>

            <PreviewUsersTable users={tempUsers} show={modalActive} close={closeModal}/>
        </>

    )
}
