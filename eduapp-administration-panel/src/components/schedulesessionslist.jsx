import React from 'react'
import '../styles/schedulesessionslist.css'
export default function Schedulesessionslist() {
  return (
    <div className="schedulesesionslist-main-container">
        <table>
            <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Week</th>
                <th>Links</th>
                <th>Actions</th>
            </tr>
        </table>
    </div>
  )
}
