import React from 'react';
import { ClientType, ProjectType } from '../../types/types';
import { RootState } from '../../states/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import ClientInfoSection from '../Client_Component/ClientInfoSection';
import { Button, useTheme } from '@mui/material';
import Styles from "./invoive.module.css";
import { removeProjectFromInvoiceAction } from '../../states/redux/InvoiceProjectState/addProjectForInvoiceSlice';
import BillAmount from "../../components/Home_Components/InvoiceSection/BillAmount";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import Typography from "@mui/material/Typography";
import error from "../assets/project_error.png"


function InvoiceClientPage() {
  const materialTheme = useTheme();
  const dispatch = useDispatch();
  const selectedClientState = useSelector(
    (state: RootState) => state.selectedClientState
  );
  const clientObj: ClientType = selectedClientState.data;

  const { projectsForInvoice } = useSelector(
    (state: RootState) => state.projectsForInvoiceState
  );

  const handleRemoveProject = (project: ProjectType) => {
    if (project && project._id) {
      dispatch(removeProjectFromInvoiceAction(project._id));
    }
  };

  return (
    <div>
      <div className='flex items-center gap-2'>
          <Link to="/client/details" className="text-white text-[20px] bg-[#E4A98A] w-[35px] h-[35px] flex justify-center items-center rounded-[50px] ">
            <IoIosArrowBack />
          </Link>
          <Typography variant="h5" component="h2" className='text-center'>
            CLIENT INFORMATION
          </Typography>
          
        </div>
      <div>
        {clientObj && selectedClientState.loading !== "idle" ? (
          <ClientInfoSection />
        ) : null}
      </div>
      <div >
        <div className={`${Styles.table_scroll}`} >
          
          <div className={`${Styles.project_scroll}`}>
          {projectsForInvoice?.map((project: ProjectType) => (
            <div key={project._id} className={`${Styles.project_card}`}>
              <p className="text-[19px] w-[150px] overflow-hidden whitespace-nowrap text-ellipsis">
  <strong>{project.projectName}</strong>
</p>

              {/* <p><strong>Manager:</strong> {project.projectManager}</p> */}
              {/* <p><strong>Period:</strong> 
                {project.projectPeriod ? (
                  `${project.projectPeriod} (${project.workingPeriodType})`
                ) : (
                  "Hour based project"
                )}
              </p> */}
              <p className='text-[13px]'><strong>Rate:</strong> 
                {project.rate} 
                ({project.currencyType === "rupees" ? (
                  <span>&#x20B9;</span>
                ) : project.currencyType === "dollars" ? (
                  <span>$</span>
                ) : project.currencyType === "pounds" ? (
                  <span>&#163;</span>
                ) : null}/{project.workingPeriodType})
              </p>
              <p className='text-[13px]'><strong>Working Time:</strong> 
                {project.workingPeriod} ({project.workingPeriodType})
              </p>
              <p className='text-[13px]'><strong>Conversion Rate:</strong> 
                {project.currencyType === "rupees" ? (
                  <span>&#x20B9; </span>
                ) : project.currencyType === "dollars" ? (
                  <span>$ </span>
                ) : project.currencyType === "pounds" ? (
                  <span>&#163; </span>
                ) : null}
                {project.conversionRate}
              </p>
              <p><strong>Amount:</strong> &#x20B9; {project.amount ? project.amount : 0}</p>
              <div className={`${Styles.remove_btn}`}>
                <Button
                  onClick={() => handleRemoveProject(project)}
                  className={Styles.removeButton}
                >
                 <RxCross1 />
                </Button>
              </div>
            </div>
          ))}
          </div>
        </div>
      
      </div>
      <div>
        {projectsForInvoice.length > 0 ? (
          <BillAmount />
        ) : (
          
          <div>
            <div className='flex flex-col h-[60vh] justify-center items-center '>
              <img src={error} alt="" className='w-[300px]'/>
              <p>No Project Selected</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InvoiceClientPage;
