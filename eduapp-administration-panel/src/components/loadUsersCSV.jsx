import React from 'react'
import CSVReader from 'react-csv-reader'
import './componentStyles/loadUsersCSV.css'
export default function LoadUsersCSV(props) {

    const previewUsersLoad = (data, fileInfo, originalFile) => {
        console.log(data);
        const TempUsers = document.getElementById('tempUsersUploading');
        data.map((user) => {
            
            let payLoad = <tr>
                {user.map((x)=>{
                    return <td>{x}</td>
                })}

            </tr>
            console.log(payLoad)
            TempUsers.innerHTML = payLoad;
        })
            

        }
    return (
        <>
            <div className="csvLoaderButton">
                <CSVReader onFileLoaded={(data, fileInfo, originalFile) => previewUsersLoad(data, fileInfo, originalFile)} />
            </div>

           
        </>

    )
}
