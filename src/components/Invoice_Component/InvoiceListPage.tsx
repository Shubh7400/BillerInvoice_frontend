import React from 'react'
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { Grid, Typography, Select, MenuItem, FormControl, styled, SelectChangeEvent } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
function InvoiceListPage() {
  const navigate = useNavigate();
  return (
    <div>
      <div className='flex justify-between items-center  pb-[10]'>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => navigate(-1)}
            className="text-white text-[20px] bg-[#E4A98A] w-[35px] h-[35px] flex justify-center items-center rounded-[50px]"
          >
            <IoIosArrowBack />
          </button>
          <Typography variant="h5" component="h2" className='text-center'>
            INVOICE LIST
          </Typography>
        </div>


      </div>
    </div>
  )
}

export default InvoiceListPage