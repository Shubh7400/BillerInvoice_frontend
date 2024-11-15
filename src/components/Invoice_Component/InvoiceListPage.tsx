import React from 'react'
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { Grid, Typography, Select, MenuItem, FormControl, styled, SelectChangeEvent } from '@mui/material';


function InvoiceListPage() {
  return (
    <div>
      <div className='flex justify-between items-center  pb-[10]'>
        <div className='flex items-center gap-2'>
          <Link to="/invoices" className="text-white text-[20px] bg-[#E4A98A] w-[35px] h-[35px] flex justify-center items-center rounded-[50px] ">
            <IoIosArrowBack />
          </Link>
          <Typography variant="h5" component="h2" className='text-center'>
            INVOICE LIST
          </Typography>
        </div>
    
        
      </div>
    </div>
  )
}

export default InvoiceListPage