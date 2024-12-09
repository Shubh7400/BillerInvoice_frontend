import React from 'react'
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { Grid, Typography, Select, MenuItem, FormControl, styled, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, } from '@mui/material';
import Styles from "../Project_Component/ProjectTable.module.css"
import { CiEdit } from "react-icons/ci";
import ActionConfirmer from "../SideBar/ActionConfirmer";
import {
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
import { ProjectType } from '../../types/types';
import { useState,useContext } from 'react';
import { RootState } from '../../states/redux/store';
import { useSelector } from 'react-redux';
import { AuthContext } from "../../states/context/AuthContext/AuthContext";
function InvoiceListPage() {
  const navigate = useNavigate();
  const materialTheme = useTheme();
  const { isAuth, adminId } = useContext(AuthContext);
  const [projectDataForInvoice, setProjectDataForInvoice] = useState<ProjectType[]>([
    {
      _id: "1",
      projectName: "Project Alpha",
      rate: 100,
      workingPeriodType: "hours",
      currencyType: "dollars",
      conversionRate: 1.2,
      paymentStatus: true,
      adminId: "admin123",
      clientId: "client1",
    },
    {
      _id: "2",
      projectName: "Project Beta",
      rate: 200,
      workingPeriodType: "days",
      currencyType: "rupees",
      conversionRate: 74.5,
      paymentStatus: false,
      adminId: "admin123",
      clientId: "client2",
    },
    {
      _id: "3",
      projectName: "Project Gamma",
      rate: 150,
      workingPeriodType: "fixed",
      currencyType: "pounds",
      conversionRate: 0.85,
      paymentStatus: true,
      adminId: "admin123",
      clientId: "client3",
    },
  ]);
  const {
    loading: clientsLoading,
    data: clients,
    error: clientsError,
  } = useSelector((state: RootState) => state.allClientsState);

  const getClientNameForInvoice = (clientId: string) => {
    const selectData = clients.find((item) => item._id === clientId);
    return selectData?.clientName || "";
  };

  const handleProjectDelete = (projectId: string) => {
    console.log("project Deleted")
  };
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
      <div className="  rounded-[20px] mt-5">
      <TableContainer className={Styles.table_scroll}>
                <Table sx={{ width: "100vw" }}>
                  <TableHead className={Styles.animated}>
                    <TableRow>
                      <TableCell sx={{ paddingX: "10px", width: "50px" }}>
                        Sr.No.
                      </TableCell>
                      <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0" }}
                      >
                        Project
                      </TableCell>
                      <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0" }}
                      >
                        Client Name
                      </TableCell>
                      <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0" }}
                      >
                        Rate
                      </TableCell>
                      <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0" }}
                      >
                        Conversion Rate
                      </TableCell>
                      <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0" }}
                      >
                        Action
                      </TableCell>
                      <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0" }}
                      >
                        selection
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projectDataForInvoice &&
                      projectDataForInvoice?.map((project: ProjectType, index: number) => (
                        <TableRow key={project._id} className="p-3">
                          <TableCell
                            sx={{ paddingX: "10px", textAlign: "center" }}
                          >
                            {index + 1}
                          </TableCell>
                          <TableCell style={{ padding: "0" }}>
                            {project.projectName}
                          </TableCell>
                          <TableCell style={{ padding: "0" }}>
                            {getClientNameForInvoice(project.clientId)}
                          </TableCell>
                          <TableCell style={{ padding: "0" }}>
                            {project.rate}(
                            {project.currencyType === "rupees" ? (
                              <span>&#x20B9;</span>
                            ) : project.currencyType === "dollars" ? (
                              <span>$</span>
                            ) : project.currencyType === "pounds" ? (
                              <span>&#163;</span>
                            ) : null}
                            /{project.workingPeriodType})
                          </TableCell>
                          <TableCell style={{ padding: "0" }}>
                            <span>&#x20B9; </span>
                            {project.conversionRate}
                          </TableCell>
                          <TableCell style={{ padding: "0" }}>
                            <div className="flex">
                              <div className={Styles.editButton}>
                                <div className="">
                                  <Button
                                    disabled={!adminId}
                                    variant="outlined"
                                    sx={{
                                      color: materialTheme.palette.primary.main,
                                      borderColor:
                                        materialTheme.palette.primary.main,
                                      ":hover": {
                                        borderColor:
                                          materialTheme.palette.secondary.main,
                                        backgroundColor:
                                          materialTheme.palette.secondary.main,
                                        color: "white",
                                      },
                                      cursor: "pointer",
                                    }}
                                    
                                  >
                                    <CiEdit size={25} />
                                  </Button>
                                </div>
                              </div>
                              <div className={Styles.editButton}>
                                
                              </div>
                              <div className={Styles.editButton}>
                                <ActionConfirmer
                                  actionTag="Delete"
                                  actionFunction={handleProjectDelete}
                                  parameter={project._id}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell sx={{ paddingY: "8px" }}>
                            <div>
                              <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                  backgroundColor: "#d9a990",
                                  borderRadius: "20px",
                                  ":hover": {
                                    backgroundColor: "#4a6180",
                                  },
                                }}
                                
                              >
                                view
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              </div>
            </div>
  )
}

export default InvoiceListPage