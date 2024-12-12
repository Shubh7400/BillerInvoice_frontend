import React, { useState,useEffect } from 'react';
import { Grid, Typography, Select, MenuItem, FormControl, styled, SelectChangeEvent,Dialog, DialogTitle, DialogContent} from '@mui/material';
import Styles from './invoive.module.css';
import one from '../assets/001.gif';
import two from '../assets/002.gif';
import three from '../assets/003.gif';
import four from '../assets/004.gif';
import five from '../assets/005.gif';
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
import { RootState } from "../../states/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoiceCounts } from '../../states/redux/InvoiceProjectState/invoiceCountSlice';
import { AppDispatch } from '../../states/redux/store';
import { useContext } from "react";
import { AuthContext } from '../../states/context/AuthContext/AuthContext';

const tabsContent: YearContent[] = [
  {
    label: '2024',
    content: {
      January: '300',
      February: '301',
      March: '302',
      April: '302',
      May: '304',
      June: '305',
      July: '306',
      August: '307',
      September: '308',
      October: '309',
      November: '310',
      December: '311',
    },
  },
  {
    label: '2023',
    content: {
      January: '300',
      February: '301',
      March: '302',
      April: '302',
      May: '304',
      June: '305',
      July: '306',
      August: '307',
      September: '308',
      October: '309',
      November: '310',
      December: '311',
    },
  },
];

const monthImages: { [key: string]: string } = {
  January: one,
  February: two,
  March: three,
  April: four,
  May: five,
  June: one,
  July: two,
  August: three,
  September: four,
  October: five,
  November: one,
  December: two,
};

// Map image to colors directly
const monthColors: { [key: string]: string } = {
  [one]: 'rgb(254, 217, 164)', // Red
  [two]: 'rgb(191, 197, 210)', // Green
  [three]: 'rgb(157, 225, 229)', // Blue
  [four]: 'rgb(119, 221, 161)', // Pink
  [five]: 'rgb(254, 224, 156)', // Yellow
};

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

const TabPillsComponent: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const currentYear = new Date().getFullYear();
  const invoiceCounts = useSelector((state: RootState) => state.InvoiceCountState);
  const { adminId } = useContext(AuthContext);

  const [isFilterPopupOpen, setFilterPopupOpen] = useState<boolean>(false); 
  const [fromMonth, setFromMonth] = useState<string>('January');
  const [fromYear, setFromYear] = useState<string>(tabsContent[0].label);
  const [toMonth, setToMonth] = useState<string>('December');
  const [toYear, setToYear] = useState<string>(tabsContent[0].label);

  const [dropdownIndex, setDropdownIndex] = useState<number>(0);
  useEffect(() => {
    if (adminId) {
      const selectedYear = tabsContent[dropdownIndex].label;
      dispatch(fetchInvoiceCounts({ year: selectedYear, user: adminId }));
    }
  }, [dropdownIndex, adminId, dispatch]);

  const handleDropdownChange = (event: SelectChangeEvent<unknown>) => {
    const newIndex = Number(event.target.value as string);
    setDropdownIndex(newIndex);
    };

    const handleFilterApply = () => {
    console.log(`Filter from ${fromMonth} ${fromYear} to ${toMonth} ${toYear}`);
    setFilterPopupOpen(false); 
  };

const getMonthNumber = (monthName: string): number => {
  return new Date(`${monthName} 1`).getMonth() + 1;
};

const handleMonthClick = (year: string, month: string) => {
  const numericMonth = getMonthNumber(month);
  navigate(`/invoice/details?year=${year}&month=${numericMonth}`);
};

  const monthNames = Object.keys(tabsContent[dropdownIndex].content);

  return (
    <div>
      <div className='flex justify-between items-center mt-[-10px]'>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => navigate(-1)}
            className="text-white text-[20px] bg-[#E4A98A] w-[35px] h-[35px] flex justify-center items-center rounded-[50px]"
          >
            <IoIosArrowBack />
          </button>
          <Typography variant="h5" component="h2" className='text-center'>
            INVOICE
          </Typography>
        </div>
        <div>
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => setFilterPopupOpen(true)} 
        >
          Invoice Filter
        </Button>
        </div>
      </div>

      {/* Popup Dialog */}
      <Dialog open={isFilterPopupOpen} onClose={() => setFilterPopupOpen(false)}>
        <DialogTitle>Invoice Filter</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <Typography variant="subtitle1">From</Typography>
              <FormControl style={{ marginRight: '8px' }}>
                <Select
                  value={fromMonth}
                  onChange={(e) => setFromMonth(e.target.value as string)}
                >
                  {monthNames.map((month) => (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <Select
                  value={fromYear}
                  onChange={(e) => setFromYear(e.target.value as string)}
                >
                  {tabsContent.map((tab) => (
                    <MenuItem key={tab.label} value={tab.label}>
                      {tab.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div>
              <Typography variant="subtitle1">To</Typography>
              <FormControl style={{ marginRight: '8px' }}>
                <Select
                  value={toMonth}
                  onChange={(e) => setToMonth(e.target.value as string)}
                >
                  {monthNames.map((month) => (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <Select
                  value={toYear}
                  onChange={(e) => setToYear(e.target.value as string)}
                >
                  {tabsContent.map((tab) => (
                    <MenuItem key={tab.label} value={tab.label}>
                      {tab.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFilterApply} 
          >
            Apply Filter
          </Button>
        </DialogContent>
      </Dialog>


      {/* Dropdown Content */}
      <Grid container spacing={2}>
        {monthNames.map((month: string, index: number) => {
          const apiMonthData = invoiceCounts.data.find(
            (data) => data.month === index + 1
          );
        
          const isCurrentYear = tabsContent[dropdownIndex].label === currentYear.toString();
          const isUpcomingMonth = isCurrentYear && index > new Date().getMonth();
          const displayData = isUpcomingMonth ? 'N/A' : apiMonthData?.count ?? '0';

          // Get the image path for the month
          const imagePath = monthImages[month];
          // Set color based on the image path
          const buttonColor = monthColors[imagePath] || '#E4A98A'; // Default color if no match

          return (
            <Grid item xs={3} key={month} className={`${Styles.motion_btn} relative`}>
              <img
                src={imagePath}
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
                style={{ fontSize: '60px', color: '#000', fontWeight: '300', fontFamily: 'Rubik' }}
              >
                {displayData}
              </Typography>

              <Typography
                variant="h6"
                className='absolute bottom-[16px] right-[25%] uppercase'
                style={{ fontSize: '20px', color: '#000', fontWeight: '500' }}
                onClick={() => handleMonthClick(tabsContent[dropdownIndex]?.label, month)}
              >
                {month}
              </Typography>

              {/* Apply dynamic color to the button */}
              <Link
                to="/invoice/details"
                className={`text-gray-700 text-[20px] absolute bottom-[-5px] right-[-9px] bg-[#d1d1d194] w-[20%] h-[30%] flex justify-center items-center rounded-[50%] hover:border ${isUpcomingMonth ? 'pointer-events-none opacity-50' : ''}`}
                style={{
                  backgroundColor: buttonColor, // Apply dynamic color here
                }}
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
