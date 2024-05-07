import React from 'react'
import Slidebar from '../../Components/Slidebar/Slidebar'
import Navbar from '../../Components/NavbarAdmin/Navbar'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div>
        <Navbar/>
        <Slidebar/>
        <Outlet/>
    </div>
  )
}

export default AdminLayout