import React, { useState } from 'react'
import CSVReader from 'react-csv-reader'
import './componentStyles/loadUsersCSV.css'
import PreviewUsersTable from './previewUsersTable'
export default function LoadUsersCSV(props) {
    let tempUsers = []
    const [modal, setModal] = useState(false)

    const previewUsersLoad = (data, fileInfo, originalFile) => {
        data.map((user) => {
            if (user[0] !== '') {
                console.log('currentuser', user)
                tempUsers.push(user)
            }

        })
        console.log(tempUsers, 'tt')
        document.getElementsByClassName('modalConfirmUpload')[0].classList.remove('hidden')
        setModal(true)


    }

    return (
        <>
            <div className="csvLoaderButton">
                <CSVReader onFileLoaded={(data, fileInfo, originalFile) => previewUsersLoad(data, fileInfo, originalFile)} />
            </div>

            <div className={'hidden modalConfirmUpload'}>
                <div className="cancelUsersUpload">x</div>
                {
                    modal && <PreviewUsersTable users={tempUsers}/>
                }
                

                <button>Confirm and subscribe the users</button>
            </div>
        </>

    )
}
