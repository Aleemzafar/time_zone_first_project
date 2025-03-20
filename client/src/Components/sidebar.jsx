import React from 'react'
import { Link } from 'react-router-dom'
export default function sidebar() {
  return (
    <div>
       <div className="sidebar">                        
                            <ul className='sidebarul'>
                                <li>
                                    <Link className='links' to="/dashboard">Dashboard</Link>
                                </li>
                                <li>
                                    <Link className='links' to="/allproductsforadmin">Allproduct</Link>
                                </li>
                                <li>
                                    <Link className='links' to="/allusersforadmin">Allusers</Link>
                                </li>
                                <li>
                                    <Link className='links' to="/addminprofile">ProfileAdmin</Link>
                                </li>
                                <li>
                                    <Link className='links' to="/allorders">Allorders</Link>
                                </li>
                                <li>
                                    <Link className='links' to="/addnewproduct">Add New Profuct</Link>
                                </li>
                            </ul>
                        </div>
    </div>
  )
}
