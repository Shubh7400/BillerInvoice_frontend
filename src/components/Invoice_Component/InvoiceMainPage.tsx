import React, { useState } from 'react';
import { Grid, Typography, Select, MenuItem, FormControl, styled, SelectChangeEvent } from '@mui/material';
import Styles from './invoive.module.css';
import jan from '../assets/001.gif';
import feb from '../assets/002.gif';
import mar from '../assets/003.gif';
import apr from '../assets/004.gif';
import may from '../assets/005.gif';
import jun from '../assets/001.gif';
import jul from '../assets/002.gif';
import aug from '../assets/003.gif';
import sept from '../assets/004.gif';
import oct from '../assets/005.gif';
import nov from '../assets/001.gif';
import dec from '../assets/002.gif';
import { Link } from "react-router-dom";
import { Outlet, useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";

const StyledSelect = styled(Select)({
  '&.MuiInputBase-root': {
    border: 'none',
    boxShadow: 'none',
    width: '130px',
    margin: '0 auto',
    fontSize: '40px',
    padding: '0',
    fontWeight: 'bold',
    color: '#E4A98A',
  },
  '& .MuiSelect-icon': {
    color: '#E4A98A',
  },
  '& .MuiSelect-select': {
    padding: '0',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiList-root': {
    display: 'flex',
    minWidth: '300px',
    overflowX: 'auto',
  },
  
});

interface MonthData {
  [key: string]: string;
}

interface YearContent {
  label: string;
  content: MonthData;
}

const monthImages: { [key: string]: string } = {
  January: jan,
  February: feb,
  March: mar,
  April: apr,
  May: may,
  June: jun,
  July: jul,
  August: aug,
  September: sept,
  October: oct,
  November: nov,
  December: dec,
};

const TabPillsComponent: React.FC = () => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [dropdownIndex, setDropdownIndex] = useState<number>(0);
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0 (January) to 11 (December)
  
  const handleDropdownChange = (event: SelectChangeEvent<unknown>) => {
    const newIndex = Number(event.target.value as string);
    setDropdownIndex(newIndex);
    setTabIndex(newIndex);
  };

  const tabsContent: YearContent[] = [
    {
      label: '2022',
      content: {
        January: '23',
        February: '400',
        March: '184',
        April: '32',
        May: '42',
        June: '434',
        July: '12',
        August: '123',
        September: '32',
        October: '432',
        November: '87',
        December: '78',
      },
    },
    {
      label: '2023',
      content: {
        January: '231',
        February: '4030',
        March: '1845',
        April: '32',
        May: '42',
        June: '434',
        July: '12',
        August: '123',
        September: '32',
        October: '432',
        November: '87',
        December: '78',
      },
    },
    {
      label: '2024',
      content: {
        January: '231',
        February: '4030',
        March: '1845',
        April: '32',
        May: '42',
        June: '434',
        July: '12',
        August: '123',
        September: '32',
        October: '432',
        November: '87',
        December: '0',
      },
    },
  ];

  const monthNames = Object.keys(tabsContent[dropdownIndex].content);

  return (
    <div>
      <div className='flex justify-between items-center mt-[-10px]'>
        <div className='flex items-center gap-2'>
          <Link to="/" className="text-white text-[20px] bg-[#E4A98A] w-[35px] h-[35px] flex justify-center items-center rounded-[50px] ">
            <IoIosArrowBack />
          </Link>
          <Typography variant="h5" component="h2" className='text-center'>
            INVOICE 
          </Typography>
        </div>
        <FormControl>
          <StyledSelect
            labelId="tab-dropdown"
            value={dropdownIndex.toString()}
            onChange={handleDropdownChange}
            disableUnderline
            className='flex'
          >
            {tabsContent.map((tab, index) => (
              <MenuItem key={index} value={index.toString()}>
                {tab.label}
              </MenuItem>
            ))}
          </StyledSelect>
        </FormControl>
      </div>

      {/* Dropdown Content */}
      <Grid container spacing={2}>
        {monthNames.map((month, index) => {
          const isCurrentYear = tabsContent[dropdownIndex].label === currentYear.toString();
          const isUpcomingMonth = isCurrentYear && index > currentMonth;
          const displayData = isUpcomingMonth ? 'N/A' : tabsContent[dropdownIndex].content[month];
          
          return (
            <Grid item xs={3} key={month} className='relative'>
              <img
                src={monthImages[month]}
                alt={`${month} image`}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  filter: isUpcomingMonth ? 'grayscale(100%)' : 'none',
                }}
              />
              
              <Typography
                variant="h6"
                component="span"
                className='absolute top-5 right-3'
                style={{ fontSize: '60px', color: '#000', fontWeight: '500' }}
              >
                {displayData}
              </Typography>

              <Typography
                variant="h6"
                className='absolute bottom-[16px] right-[4.5rem]'
                style={{ fontSize: '20px', color: '#000', fontWeight: '500' }}
              >
                {month}
              </Typography>
              
              <Link
                to="/invoice/details"
                className={`text-gray-700 text-[20px] absolute bottom-[-5px] right-[-9px] bg-[#d1d1d194] w-[55px] h-[55px] flex justify-center items-center rounded-[50px] hover:border ${isUpcomingMonth ? 'pointer-events-none opacity-50' : ''}`}
              >
                <FaArrowRight className={Styles.arrow} />
              </Link>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default TabPillsComponent;
