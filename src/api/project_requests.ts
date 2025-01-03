import axios from "axios";
import config from "../config/config";
import { ProjectType, UpdateProjectDataType } from "../types/types";

export async function getAllProjectsByClientId(clientId: string) {
  let token = localStorage.getItem("billAppAuthToken");
  if (token) {
    token = token.substring(1, token.length - 1);
  }
  try {
    const response = await axios(`${config.apiUrlProject}/client/${clientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(
      "================res after getAllProjectByClients================>",
      response
    );
    return response.data;
  } catch (error) {
    console.log(
      "Error in getting allprojects :from getAllClients function-",
      error
    );
    throw new Error("Error in getting all client projects");
  }
}

export async function addProject(projectData: FormData) {
  let token = localStorage.getItem("billAppAuthToken");
  if (token) {
    token = token.substring(1, token.length - 1);
  }

  try {
    const response = await axios.post(`${config.apiUrlProject}`, projectData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data', // Ensure the correct content type
      },
    });
    return response.data;
  } catch (error) {
    console.log(
      "Error in adding project :from adding project function-",
      error
    );
    throw new Error("Error in adding project");
  }
}

export async function getProjectById(projectId: string) {
  let token = localStorage.getItem("billAppAuthToken");
  if (token) {
    token = token.substring(1, token.length - 1);
  }

  try {
    const res = await axios(`${config.apiUrlProject}/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log(
      "Error in getProjectById project :from  getProjectById axios project function-",
      error
    );
    throw new Error("Error in getProjectById");
  }
}

export async function editProject(
  projectId: string,
  updatedProjectData: FormData
) {
  let token = localStorage.getItem("billAppAuthToken");
  if (token) {
    token = token.substring(1, token.length - 1);
  }

  try {
    const res = await axios.patch(
      `${config.apiUrlProject}/${projectId}`,
      updatedProjectData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error in updating project:", error);
    throw new Error("Error in updating project");
  }
}



export async function deleteProject(projectId: string) {
  let token = localStorage.getItem("billAppAuthToken");
  if (token) {
    token = token.substring(1, token.length - 1);
  }

  try {
    const res = await axios.delete(`${config.apiUrlProject}/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log(
      "Error in deleting project :from  deleting axios project function-",
      error
    );
    throw new Error("Error in deleting project");
  }
}

export async function getAllProjectsByAdminId(AdminId: string) {
  let token = localStorage.getItem("billAppAuthToken");
  if (token) {
    token = token.substring(1, token.length - 1);
  }
  try {
    const response = await axios.get(`${config.apiUrlProject}/admin/${AdminId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(
      "================res after getAllProjectByAdminId================>",
      response
    );
    return response.data;
  } catch (error) {
    console.log(
      "Error in getting allprojects :from getAllClients function-",
      error
    );
    throw new Error("Error in getting all admin projects");
  }
}
